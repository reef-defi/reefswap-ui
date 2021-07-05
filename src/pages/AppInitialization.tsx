import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { WsProvider } from '@polkadot/api';
import { Provider } from '@reef-defi/evm-provider';
import { LoadingWithText } from '../components/loading/Loading';
import ErrorCard from '../components/error/ErrorCard';
import ContentController from './ContentController';
import { ReducerState } from '../store/reducers';
import {
  utilsSetAccounts,
  utilsSetSelectedAccount,
} from '../store/actions/accounts';
import { accountsToSigners } from '../api/accounts';
import { loadTokens, loadVerifiedERC20TokenAddresses } from '../api/tokens';
import { setAllTokens } from '../store/actions/tokens';
import { ensure } from '../utils/utils';
import { loadPools } from '../api/pools';
import { setPools } from '../store/actions/pools';
import { ErrorState, ERROR_STATE, LoadingContentState, LOADING_MESSAGE_STATE, SuccessState, SUCCESS_STATE, toError, toLoading, toLoadingMessage, toSuccess } from '../store/internalStore';

type State =
  | ErrorState
  | SuccessState
  | LoadingContentState;

const AppInitialization = (): JSX.Element => {
  const dispatch = useDispatch();
  const { tokens, reloadTokens } = useSelector((state: ReducerState) => state.tokens);
  const { reloadPool } = useSelector((state: ReducerState) => state.pools);
  const { chainUrl } = useSelector((state: ReducerState) => state.settings);
  const { selectedAccount, accounts } = useSelector((state: ReducerState) => state.accounts);

  const [state, setState] = useState<State>(toLoadingMessage(""));

  const loader = async (callback: () => Promise<void>) => {
    try {
      message("");
      await callback();
      setState(toSuccess());
    } catch (e) {
      setState(toError(e.message));
    } 
  };

  const message = (message: string): void => setState(toLoadingMessage(message));

  useEffect(() => {
    const load = async (): Promise<void> => {
      message('Connecting to Polkadot extension...');
      const inj = await web3Enable('Reefswap');
      ensure(inj.length > 0, 'Polkadot extension is disabled! You need to approve the app in Polkadot-extension!');

      message('Retrieving accounts...');
      const web3accounts = await web3Accounts();
      ensure(web3accounts.length > 0, 'To use Reefswap you need to create Polkadot account in Polkadot-extension!');

      message('Connecting to chain...');
      const provider = new Provider({
        provider: new WsProvider(chainUrl),
      });
      await provider.api.isReadyOrError;

      message('Creating signers...');
      const signers = await accountsToSigners(
        web3accounts,
        provider,
        inj[0].signer,
      );

      message('Loading tokens...');
      const addresses = await loadVerifiedERC20TokenAddresses(chainUrl);
      const newTokens = await loadTokens(addresses, signers[0].signer);

      message('Loading pools...');
      const pools = await loadPools(newTokens, signers[0].signer);

      dispatch(setPools(pools));
      dispatch(setAllTokens(newTokens));
      dispatch(utilsSetAccounts(signers));
      // Make sure selecting account is after setting signers
      // Else error will occure
      dispatch(utilsSetSelectedAccount(0));
    };

    loader(load);
  }, [chainUrl]);

  useEffect(() => {
    if (selectedAccount === -1 || !reloadTokens) { return; }

    const load = async (): Promise<void> => {
      const { signer } = accounts[selectedAccount];
      
      message('Loading token balances...');
      const addresses = tokens.map((token) => token.address);
      const newTokens = await loadTokens(addresses, signer);

      dispatch(setAllTokens(newTokens));
    };
    loader(load);
  }, [selectedAccount, reloadTokens]);

  useEffect(() => {
    if (selectedAccount === -1 || !reloadPool) { return; }

    const load = async (): Promise<void> => {
      message('Loading user pools...');
      const {signer} = accounts[selectedAccount];
      const pools = await loadPools(tokens, signer);

      dispatch(setPools(pools));
    };
    loader(load);
  }, [selectedAccount, reloadPool])

  return (
    <>
      {state.type === LOADING_MESSAGE_STATE && <LoadingWithText text={state.message} />}
      {state.type === ERROR_STATE && <ErrorCard title="Polkadot extension" message={state.message} />}
      {state.type === SUCCESS_STATE && <ContentController /> }
    </>
  );
};

export default AppInitialization;

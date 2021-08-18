import React, { useEffect, useState } from 'react';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { WsProvider } from '@polkadot/api';
import { Provider } from '@reef-defi/evm-provider';
import { LoadingWithText } from '../components/loading/Loading';
import ErrorCard from '../components/error/ErrorCard';
import ContentController from './ContentController';
import {
  utilsSetAccounts,
  utilsSetSelectedAccount,
} from '../store/actions/accounts';
import { setAllTokensAction } from '../store/actions/tokens';
import { ensure } from '../utils/utils';
import { setPools } from '../store/actions/pools';
import {
  ErrorState, LoadingMessageState, SuccessState, toError, toLoadingMessage, toSuccess,
} from '../store/internalStore';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { accountsToSigners } from '../api/rpc/accounts';
import { loadPools } from '../api/rpc/pools';
import { loadVerifiedERC20Tokens, loadTokens } from '../api/rpc/tokens';

type State =
  | ErrorState
  | SuccessState
  | LoadingMessageState;

const AppInitialization = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { reloadPool } = useAppSelector((state) => state.pools);
  const { chainUrl } = useAppSelector((state) => state.settings);
  const { tokens, reloadTokens } = useAppSelector((state) => state.tokens);
  const { selectedAccount, accounts } = useAppSelector((state) => state.accounts);

  const [state, setState] = useState<State>(toLoadingMessage(''));

  const message = (msg: string): void => setState(toLoadingMessage(msg));
  const loader = async (callback: () => Promise<void>): Promise<void> => {
    try {
      message('');
      await callback();
      setState(toSuccess());
    } catch (e) {
      setState(toError(e.message));
    }
  };

  // Initial setup
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
      const verifiedTokens = await loadVerifiedERC20Tokens(chainUrl);
      const newTokens = await loadTokens(verifiedTokens, signers[0].signer);

      message('Loading pools...');
      const pools = await loadPools(newTokens, signers[0].signer);

      dispatch(setPools(pools));
      dispatch(setAllTokensAction(newTokens));
      dispatch(utilsSetAccounts(signers));
      // Make sure selecting account is after setting signers
      // Else error will occure
      dispatch(utilsSetSelectedAccount(0));
    };

    loader(load);
  }, [chainUrl]);

  // Reload tokens
  useEffect(() => {
    if (selectedAccount === -1) { return; }
    const { signer } = accounts[selectedAccount];

    const tokenLoader = async (): Promise<void> => {
      message('Loading token balances...');
      const newTokens = await loadTokens(tokens, signer);

      dispatch(setAllTokensAction(newTokens));
    };

    const poolLoader = async (): Promise<void> => {
      message('Loading pools...');
      const pools = await loadPools(tokens, signer);

      dispatch(setPools(pools));
    };

    loader(async () => {
      if (reloadTokens) { await tokenLoader(); }
      if (reloadPool) { await poolLoader(); }
    });
  }, [selectedAccount, reloadTokens, reloadPool]);

  return (
    <>
      {state._type === 'SuccessState' && <ContentController /> }
      {state._type === 'LoadingMessageState' && <LoadingWithText text={state.message} />}
      {state._type === 'ErrorState' && <ErrorCard title="Polkadot extension" message={state.message} />}
    </>
  );
};

export default AppInitialization;

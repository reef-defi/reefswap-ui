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

enum State {
  LOADING,
  ERROR,
  SUCCESS
}

const AppInitialization = (): JSX.Element => {
  const dispatch = useDispatch();
  const { tokens } = useSelector((state: ReducerState) => state.tokens);
  const { chainUrl } = useSelector((state: ReducerState) => state.settings);
  const { selectedAccount, accounts } = useSelector((state: ReducerState) => state.accounts);

  const [state, setState] = useState<State>(State.SUCCESS);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        setError("")
        setState(State.LOADING);
        setStatus('Connecting to Polkadot extension...');
        const inj = await web3Enable('Reefswap');
        ensure(inj.length > 0, 'Polkadot extension is disabled! You need to approve the app in Polkadot-extension!');

        setStatus('Retrieving accounts...');
        const web3accounts = await web3Accounts();
        ensure(web3accounts.length > 0, 'To use Reefswap you need to create Polkadot account in Polkadot-extension!');

        setStatus('Connecting to chain...');
        const provider = new Provider({
          provider: new WsProvider(chainUrl),
        });
        await provider.api.isReadyOrError;

        setStatus('Creating signers...');
        const signers = await accountsToSigners(
          web3accounts,
          provider,
          inj[0].signer,
        );

        setStatus('Loading tokens...');
        const addresses = await loadVerifiedERC20TokenAddresses(chainUrl);
        console.log(addresses);
        const newTokens = await loadTokens(addresses, signers[0].signer);

        dispatch(setAllTokens(newTokens));
        dispatch(utilsSetAccounts(signers));
        // Make sure selecting account is after setting signers
        // Else error will occure
        dispatch(utilsSetSelectedAccount(0));
        setState(State.SUCCESS);
      } catch (e) {
        setError(e.message);
        setState(State.ERROR);
      } finally {
        setIsLoaded(true);
      }
    };

    load();
  }, [chainUrl]);

  useEffect(() => {
    if (selectedAccount === -1 || !isLoaded) { return; }

    const load = async (): Promise<void> => {
      try {
        setIsLoaded(false);
        setState(State.LOADING);
        setStatus('Loading token balances...');
        const { signer } = accounts[selectedAccount];
        const addresses = tokens.map((token) => token.address);
        const newTokens = await loadTokens(addresses, signer);
        dispatch(setAllTokens(newTokens));
        setState(State.SUCCESS);
      } catch (e) {
        setError(e.message);
        setState(State.ERROR);
      } finally {
        setIsLoaded(true);
      }
    };
    load();
  }, [selectedAccount]);

  return (
    <>
      {state === State.LOADING && <LoadingWithText text={status} />}
      {state === State.ERROR
        && <ErrorCard title="Polkadot extension" message={error} />}
      {state === State.SUCCESS && !isLoaded
        && <ErrorCard title="Context error" message="Something went wrong..." />}
      {state === State.SUCCESS && isLoaded && <ContentController /> }
    </>
  );
};

export default AppInitialization;

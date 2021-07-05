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
import { setReloadBalance } from '../store/actions/settings';
import { loadPools } from '../api/pools';
import { setPools } from '../store/actions/pools';

enum State {
  LOADING,
  ERROR,
  SUCCESS
}

const AppInitialization = (): JSX.Element => {
  const dispatch = useDispatch();
  const { tokens } = useSelector((state: ReducerState) => state.tokens);
  const { reloadPool } = useSelector((state: ReducerState) => state.pools);
  const { chainUrl, reloadBalance } = useSelector((state: ReducerState) => state.settings);
  const { selectedAccount, accounts } = useSelector((state: ReducerState) => state.accounts);

  const [state, setState] = useState<State>(State.SUCCESS);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const defaultLoad = async (callback: () => Promise<void>) => {
    try {
      setState(State.LOADING);
      await callback();
      setState(State.SUCCESS);
    } catch (e) {
      setError(e.message);
      setState(State.ERROR);
    } 
  }

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
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
        const newTokens = await loadTokens(addresses, signers[0].signer);

        setStatus('Loading pools...');
        const pools = await loadPools(newTokens, signers[0].signer);

        dispatch(setPools(pools));
        dispatch(setAllTokens(newTokens));
        dispatch(utilsSetAccounts(signers));
        // Make sure selecting account is after setting signers
        // Else error will occure
        dispatch(utilsSetSelectedAccount(0));
        setState(State.SUCCESS);
      } catch (e) {
        setError(e.message);
        setState(State.ERROR);
      }
    };

    load();
  }, [chainUrl]);

  useEffect(() => {
    if (selectedAccount === -1 || !reloadBalance) { return; }

    const load = async (): Promise<void> => {
      try {
        setState(State.LOADING);
        const { signer } = accounts[selectedAccount];
        
        setStatus('Loading token balances...');
        const addresses = tokens.map((token) => token.address);
        const newTokens = await loadTokens(addresses, signer);

        setStatus('Loading pools...');
        const pools = await loadPools(newTokens, signer);

        dispatch(setPools(pools));
        dispatch(setAllTokens(newTokens));
        dispatch(setReloadBalance(false));
        setState(State.SUCCESS);
      } catch (e) {
        setError(e.message);
        setState(State.ERROR);
      }
    };
    load();
  }, [selectedAccount, reloadBalance]);

  useEffect(() => {

  })

  return (
    <>
      {state === State.LOADING && <LoadingWithText text={status} />}
      {state === State.ERROR && <ErrorCard title="Polkadot extension" message={error} />}
      {state === State.SUCCESS && <ContentController /> }
    </>
  );
};

export default AppInitialization;

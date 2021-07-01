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
  utilsSetIsLoaded,
  utilsSetProvider,
  utilsSetSelectedAccount,
} from '../store/actions/utils';
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
  const { isLoaded, selectedAccount, accounts } = useSelector((state: ReducerState) => state.utils);

  const [state, setState] = useState<State>(State.SUCCESS);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        setState(State.LOADING);
        setStatus('Connecting to Polkadot extension...');
        const inj = await web3Enable('Reefswap');
        ensure(inj.length > 0, "Polkadot extension is disabled! You need to approve the app in Polkadot-extension!");

        setStatus('Retrieving accounts...');
        const accounts = await web3Accounts();
        ensure(accounts.length > 0, "To use Reefswap you need to create Polkadot account in Polkadot-extension!");

        setStatus('Connecting to chain...');
        const provider = new Provider({
          provider: new WsProvider('wss://rpc-testnet.reefscan.com/ws'),
        });
        await provider.api.isReadyOrError;
        
        setStatus('Creating signers...');
        const signers = await accountsToSigners(
          accounts,
          provider,
          inj[0].signer
        );
          
        setStatus("Loading tokens...");
        const addresses = await loadVerifiedERC20TokenAddresses();
        const newTokens = await loadTokens(addresses, signers[0].signer);
        
        dispatch(utilsSetProvider(provider));
        dispatch(setAllTokens(newTokens));
        dispatch(utilsSetAccounts(signers));
        // Make sure selecting account is after setting signers
        // Else error will occure
        dispatch(utilsSetSelectedAccount(0));
        dispatch(utilsSetIsLoaded(true));
        setState(State.SUCCESS);
      } catch (e) {
        setError(e.message);
        setState(State.ERROR);
      }
    };

    load();
  }, [dispatch]);

  useEffect(() => {
    if (selectedAccount === -1) { return; }

    const load = async (): Promise<void> => {
      try {
        setState(State.LOADING);
        setStatus("Loading token balances...");
        const {signer} = accounts[selectedAccount];
        const addresses = tokens.map((token) => token.address);
        const newTokens = await loadTokens(addresses, signer);
        dispatch(setAllTokens(newTokens));
        setState(State.SUCCESS)
      } catch (error) {
        setError(error.message);
        setState(State.ERROR);
      }
    };
    load();
  }, [selectedAccount, dispatch])

  return (
    <div className="container-fluid mt-4 w-100">
      <div className="row justify-content-center">
        <div className="col-sm-10 col-md-6 col-lg-4 col-xl-3 field-size">
          {state === State.LOADING && <LoadingWithText text={status} />}
          {state === State.ERROR
            && <ErrorCard title="Polkadot extension" message={error} />}
          {state === State.SUCCESS && !isLoaded
            && <ErrorCard title="Context error" message="Something went wrong..." />}
          {state === State.SUCCESS && isLoaded && <ContentController /> }
        </div>
      </div>
    </div>
  );
};

export default AppInitialization;

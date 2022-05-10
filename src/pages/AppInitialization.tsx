import React, { useEffect, useMemo, useRef, useState } from 'react';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { WsProvider } from '@polkadot/api';
import { Provider } from '@reef-defi/evm-provider';
import { LoadingWithText } from '../components/loading/Loading';
import ErrorCard from '../components/error/ErrorCard';
import ContentController from './ContentController';
import {
  accountsSetAccounts,
  accountsSetSelectedAccount,
} from '../store/actions/accounts';
import { ensure } from '../utils/utils';
import {
  ErrorState, LoadingMessageState, SuccessState, toError, toLoadingMessage, toSuccess,
} from '../store/internalStore';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getSignerLocalPointer } from '../store/localStore';
import { useUpdateAccountBalance } from '../hooks/useUpdateAccountBalance';
import { ApolloClient, InMemoryCache, ApolloProvider} from "@apollo/client";
import { hooks, rpc } from '@reef-defi/react-lib';
import { setAllTokensAction } from '../store/actions/tokens';
import {createApolloClient} from "./../utils/apollo";

type State =
  | ErrorState
  | SuccessState
  | LoadingMessageState;


const AppInitialization = (): JSX.Element => {
  console.log("App initialization --------------")
  const mounted = useRef(true);
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);
  const {accounts, selectedAccount} = useAppSelector((state) => state.accounts);
  const [state, setState] = useState<State>(toLoadingMessage(''));
  const [provider, setProvider] = useState<Provider>();

  const message = (msg: string): void => setState(toLoadingMessage(msg));
  const apolloClient = createApolloClient(settings.graphqlUrl);

  const signer = accounts.length > selectedAccount ? accounts[selectedAccount] : undefined;
  const tokens = hooks.useAllTokens(signer?.address, apolloClient);

  useEffect(() => {
    dispatch(setAllTokensAction(tokens));
  }, [tokens]);

  useUpdateAccountBalance(provider);
  // Initial setup
  useEffect(() => {
    const load = async (): Promise<void> => {
      console.log("Loading: " + settings.rpcUrl)
      try {
        message(`Connecting to ${settings.name.replace(/\b\w/g, (l) => l.toUpperCase())} chain...`);
        const newProvider = new Provider({
          provider: new WsProvider(settings.rpcUrl),
        });
        await newProvider.api.isReadyOrError;

        message('Connecting to Polkadot extension...');
        const inj = await web3Enable('Reefswap');
        ensure(inj.length > 0, 'Reefswap can not access Polkadot-Extension. Please install <a href="https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/" target="_blank">Polkadot-Extension</a> in your browser and refresh the page to use Reefswap.');

        message('Retrieving accounts...');
        const signers = await rpc.getExtensionSigners(inj, newProvider);
        const signerPointer = getSignerLocalPointer();
        const selectedSigner = signers.length >= signerPointer ? signerPointer : 0;

        setProvider(newProvider);
        dispatch(accountsSetAccounts(signers));

        // Make sure selecting account is after setting signers
        // Else error will occure
        dispatch(accountsSetSelectedAccount(selectedSigner));
        setState(toSuccess());
      } catch (e: any) {
        if (e.message) {
          setState(toError('Polkadot extension', e.message));
        } else {
          setState(toError('RPC', 'Can not connect to the chain, try connecting later...'));
        }
      }
    };

    load();
  }, [settings.rpcUrl]);

  return (
    <ApolloProvider client={apolloClient}>
      {state._type === 'SuccessState' && <ContentController /> }
      {state._type === 'LoadingMessageState' && <LoadingWithText text={state.message} />}
      {state._type === 'ErrorState' && <ErrorCard title={state.title} message={state.message} />}
    </ApolloProvider>
  );
};

export default AppInitialization;
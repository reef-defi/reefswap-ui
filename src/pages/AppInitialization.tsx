import React, { useEffect, useRef, useState } from 'react';
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
import { setAllTokensAction } from '../store/actions/tokens';
import { ensure } from '../utils/utils';
import {
  ErrorState, LoadingMessageState, SuccessState, toError, toLoadingMessage, toSuccess,
} from '../store/internalStore';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { accountsToSigners } from '../api/rpc/accounts';
import { loadVerifiedERC20Tokens, loadTokens } from '../api/rpc/tokens';
import { getSignerLocalPointer } from '../store/localStore';
import { updateAccountBalanceHook } from '../hooks/updateAccountBalanceHook';
import { updatePoolsHook } from '../hooks/updatePoolsHook';

type State =
  | ErrorState
  | SuccessState
  | LoadingMessageState;

const AppInitialization = (): JSX.Element => {
  const mounted = useRef(true);
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);

  const [state, setState] = useState<State>(toLoadingMessage(''));
  const [provider, setProvider] = useState<Provider>();

  const message = (msg: string): void => setState(toLoadingMessage(msg));

  updateAccountBalanceHook(provider);
  updatePoolsHook();
  // Initial setup
  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        mounted.current = true;
        message('Connecting to chain...');
        const provider = new Provider({
          provider: new WsProvider(settings.rpcUrl),
        });
        await provider.api.isReadyOrError;

        message('Connecting to Polkadot extension...');
        const inj = await web3Enable('Reefswap');
        ensure(inj.length > 0, 'Reefswap can not be access Polkadot-Extension. Please install Polkadot-Extension in your browser to use Reefswap.');
  
        message('Retrieving accounts...');
        const web3accounts = await web3Accounts();
        ensure(web3accounts.length > 0, 'To use Reefswap you need to create Polkadot account in Polkadot-extension!');

        message('Creating signers...');
        const signers = await accountsToSigners(
          web3accounts,
          provider,
          inj[0].signer,
        );
  
        const signerPointer = getSignerLocalPointer();
        const selectedSigner = signers.length >= signerPointer ? signerPointer : 0;
        message('Loading tokens...');
        const verifiedTokens = await loadVerifiedERC20Tokens(settings);
        const newTokens = await loadTokens(verifiedTokens, signers[selectedSigner].signer);

        if (mounted.current) {
          setProvider(provider);
          dispatch(setAllTokensAction(newTokens));
          dispatch(accountsSetAccounts(signers));
          // Make sure selecting account is after setting signers
          // Else error will occure
          dispatch(accountsSetSelectedAccount(selectedSigner));
          setState(toSuccess());
        }
      } catch (e) {
        if (mounted.current) {
          setState(toError(e.message ? e.message : 'Can not connect to the chain, try connecting later...'));
        }
      }
    };

    load();
    return () => {
      mounted.current = false;
     };
  }, [settings.rpcUrl, settings.reload]);

  return (
    <>
      {state._type === 'SuccessState' && <ContentController /> }
      {state._type === 'LoadingMessageState' && <LoadingWithText text={state.message} />}
      {state._type === 'ErrorState' && <ErrorCard title="Polkadot extension" message={state.message} />}
    </>
  );
};

export default AppInitialization;

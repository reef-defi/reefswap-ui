import { Provider } from "@reef-defi/evm-provider";
import { web3Enable } from "@reef-defi/extension-dapp";
import { rpc } from "@reef-defi/react-lib";
import React, { useEffect, useRef, useState } from "react"
import NavBar from "./components/navigation/NavBar";
import { useUpdateAccountBalance } from "./hooks/useUpdateAccountBalance";
import {WsProvider} from "@polkadot/api";
import { accountsSetAccounts, accountsSetSelectedAccount } from "./store/actions/accounts";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { toError, ErrorState, LoadingMessageState, SuccessState } from "./store/internalStore";
import { getSignerLocalPointer } from "./store/localStore";
import { ensure } from "./utils/utils";
import {ApolloProvider} from "@apollo/client";
import { notify } from "./utils/notify";
import ContentController from "./pages/ContentController";
import { createApolloClient } from "./utils/apollo";

interface App1 {

}

const App1 = ({} : App1): JSX.Element => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);
  const [provider, setProvider] = useState<Provider>();

  const apolloClient = createApolloClient(settings.graphqlUrl);
  useUpdateAccountBalance(provider);
  // Initial setup
  useEffect(() => {
    let mounted = true;
    const load = async (): Promise<void> => {
      try {
        notify(`Connecting to ${settings.name.replace(/\b\w/g, (l) => l.toUpperCase())} chain...`, "info");
        const newProvider = new Provider({
          provider: new WsProvider(settings.rpcUrl),
        });
        await newProvider.api.isReadyOrError;

        notify('Connecting to Polkadot extension...', 'info');
        const inj = await web3Enable('Reefswap');
        ensure(inj.length > 0, 'Reefswap can not access Polkadot-Extension. Please install <a href="https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/" target="_blank">Polkadot-Extension</a> in your browser and refresh the page to use Reefswap.');

        notify('Retrieving accounts...', 'info');
        const signers = await rpc.getExtensionSigners(inj, newProvider);
        const signerPointer = getSignerLocalPointer();
        const selectedSigner = signers.length >= signerPointer ? signerPointer : 0;

        setProvider(newProvider);
        dispatch(accountsSetAccounts(signers));

        // Make sure selecting account is after setting signers
        // Else error will occure
        dispatch(accountsSetSelectedAccount(selectedSigner));
          notify('Connected')
      } catch (e: any) {
        if (e.message) {
          notify(toError('Polkadot extension', e.message).message, "error");
        } else {
          notify('Can not connect to the chain, try connecting later...', "error");
        }
      }
    };

    load();
    return () => {mounted = false};
  }, [settings.rpcUrl, settings]);

  return (
    <ApolloProvider client={apolloClient} >
      <div className="w-100 h-100 d-flex flex-column">
        <NavBar />
        <ContentController />
      </div>
    </ApolloProvider>
  );
}

export default App1;
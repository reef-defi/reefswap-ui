import React, { createContext, useEffect, useState } from "react"

import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { LoadingComponent, LoadingWithText } from "../components/loading/Loading";
import ErrorCard from "../components/error/ErrorCard";
import ContentController from "./ContentController";
import { AppContext } from "../context/AppContext";
import { WsProvider } from "@polkadot/api";
import { Provider } from "@reef-defi/evm-provider";

interface AppInitializationProps { }

enum State {
  LOADING,
  ERROR,
  SUCCESS
}

const AppInitialization = ({} : AppInitializationProps) => {
  const [state, setState] = useState<State>(State.SUCCESS);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [context, setContext] = useState<AppContext>();

  useEffect(() => {
    const load = async () => {
      try {
        setState(State.LOADING);
        setStatus("Connecting to Polkadot extension...");
        const inj = await web3Enable("Reefswap");
        if (inj.length === 0) { throw new Error("Polkadot extension is disabled!"); }
        setStatus("Retrieving accounts...");
        const accounts = await web3Accounts();
        setStatus("Connecting to chain...")
        const provider = new Provider({
          provider: new WsProvider("wss://rpc-testnet.reefscan.com/ws")
        });
        await provider.api.isReadyOrError;
        setContext({
          provider,
          accounts,
          extension: inj[0]
        });
        setState(State.SUCCESS);
      } catch (error) {
        setError(error.message);
        setState(State.ERROR);
      }
    };

    load();
  }, [])

  return (
    <div className="container mt-4 w-100">
      <div className="row">
        <div className="col-sm-1 col-md-3 col-lg-4"></div>
        <div className="col-sm-10 col-md-6 col-lg-4">
          {state === State.LOADING && <LoadingWithText text={status} />}
          {state === State.ERROR && <ErrorCard title="Polkadot extension" message={error} />}
          {state === State.SUCCESS && !context && <ErrorCard title="Context error" message="Something went wrong..." />}
          {state === State.SUCCESS && context && 
            <AppContext.Provider value={context}>
              <ContentController />
            </AppContext.Provider>
          }
        </div>
        <div className="col-sm-1 col-md-3 col-lg-4"></div>
      </div>
    </div>
  );
}

export default AppInitialization;
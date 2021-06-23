import React, { useEffect, useState } from "react"

import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { LoadingComponent, LoadingWithText } from "../components/loading/Loading";
import ErrorCard from "../components/error/ErrorCard";
import ContentController from "./ContentController";

interface AppInitializationProps { }

enum State {
  LOADING,
  ERROR,
  SUCCESS
}

const AppInitialization = ({} : AppInitializationProps) => {
  const [state, setState] = useState<State>(State.SUCCESS);
  const [error, setError] = useState("testing");
  const [status, setStatus] = useState("Connecting to Polkadot extension...");

  useEffect(() => {
    const load = async () => {
      try {
        setState(State.LOADING);
        setStatus("Connecting to Polkadot extension...");
        const inj = await web3Enable("Reefswap");
        if (inj.length === 0) { throw new Error("Polkadot extension is disabled!"); }
        setStatus("Retrieving accounts...");
        const accounts = await web3Accounts();
        setState(State.SUCCESS);
      } catch (error) {
        setError(error.message);
        setState(State.ERROR);
      }
    };

    load();
  }, [])

  return (
    <div className="container mt-4 w-50">
      {state === State.LOADING && <LoadingWithText text={status} />}
      {state === State.ERROR && <ErrorCard title="Polkadot extension" message={error} />}
      {state === State.SUCCESS && <ContentController />}
    </div>
  );
}

export default AppInitialization;
import React, { useEffect, useState } from "react"
import {useDispatch, useSelector} from "react-redux";
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { LoadingWithText } from "../components/loading/Loading";
import ErrorCard from "../components/error/ErrorCard";
import ContentController from "./ContentController";
import { WsProvider } from "@polkadot/api";
import { Provider, Signer } from "@reef-defi/evm-provider";
import { ReducerState } from "../store/reducers";
import { ReefswapSigner, utilsSetAccounts, utilsSetIsLoaded, utilsSetProvider, utilsSetSelectedAccount } from "../store/actions/utils";

interface AppInitializationProps { }

enum State {
  LOADING,
  ERROR,
  SUCCESS
}

const AppInitialization = ({} : AppInitializationProps) => {
  const dispatch = useDispatch();
  const {isLoaded} = useSelector((state: ReducerState) => state.utils);
  const [state, setState] = useState<State>(State.SUCCESS);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

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
        setStatus("Creating signers...");

        const signers = await Promise.all(
          accounts
          .map((account) => ({
            signer: new Signer(provider, account.address, inj[0].signer),
            name: account.meta.name || "",
          }))
          .map(async (signer): Promise<ReefswapSigner> => ({...signer,
            address: await signer.signer.getAddress()
          }))
        );

        dispatch(utilsSetProvider(provider));
        dispatch(utilsSetAccounts(signers));
        dispatch(utilsSetIsLoaded(true));
        if (accounts.length > 0) {
          dispatch(utilsSetSelectedAccount(0));
        }
        setState(State.SUCCESS);
      } catch (error) {
        setError(error.message);
        setState(State.ERROR);
      }
    };

    load();
  }, [])

  return (
    <div className="container-fluid mt-4 w-100">
      <div className="row justify-content-center">
        <div className="col-sm-10 col-md-6 col-lg-4 col-xl-3 field-size">
          {state === State.LOADING && <LoadingWithText text={status} />}
          {state === State.ERROR && <ErrorCard title="Polkadot extension" message={error} />}
          {state === State.SUCCESS && !isLoaded && <ErrorCard title="Context error" message="Something went wrong..." />}
          {state === State.SUCCESS && isLoaded && <ContentController /> }
        </div>
      </div>
    </div>
  );
}

export default AppInitialization;
import React from 'react';
import logo from './logo.svg';
import './App.css';

import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
  web3ListRpcProviders,
  web3UseRpcProvider
} from '@polkadot/extension-dapp';

import { Keyring, WsProvider } from "@polkadot/api";
import {
  Provider,
  Signer,
  TestAccountSigningKey,
} from "@reef-defi/evm-provider";

import { TypeRegistry } from '@polkadot/types';

const signUp = async (): Promise<void> => {
  try {
    const inj = await web3Enable("Reefswap");
    console.log(inj);
    const accounts = await web3Accounts();
    const acc = accounts[0];
    console.log(acc);

    const keySigner = inj[0].signer;
    console.log("Key singer: ", keySigner);

    const provider =  new Provider({
      provider: new WsProvider("wss://rpc-testnet.reefscan.com/ws")
    });
    await provider.api.isReady;
    console.log("Provider connected!");

    const wallet = new Signer(provider, acc.address, keySigner);
    const address = await wallet.getAddress();
    console.log(address);

  } catch (error) {
    console.log("Error: ", error);
  }
}

function App(): JSX.Element {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit
          {' '}
          <code>src/App.tsx</code>
          {' '}
          and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button className="btn btn-primary" onClick={() => signUp()}>
          Connect
        </button>
      </header>
    </div>
  );
}

export default App;

import React from "react"
import { useDispatch, useSelector } from "react-redux";
import Card, { CardTitle } from "../../components/card/Card";
import { ReducerState } from "../../store/reducers";

enum ReefChains {
  Testnet="wss://rpc-testnet.reefscan.com/ws",
  Mainnet="wss://rpc.reefscan.com/ws",
}

const Settings = (): JSX.Element => {
  const dispatch = useDispatch();

  return (
    <Card>
      <CardTitle title="Settings" />

      <label>Select network: </label>
      <select className="form-select field-input" aria-label="Default select example">
        <option value={ReefChains.Mainnet}>Reef Mainnet</option>
        <option value={ReefChains.Testnet}>Reef Testnet</option>
      </select>
    </Card>
  );
}

export default Settings;
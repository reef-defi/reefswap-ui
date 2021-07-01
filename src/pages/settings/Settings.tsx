import React, { useState } from "react"
import { useDispatch } from "react-redux";
import { ReefChains } from "../../api/api";
import Card, { CardTitle } from "../../components/card/Card";
import { settingsSetChainUrl } from "../../store/actions/settings";

const Settings = (): JSX.Element => {
  const dispatch = useDispatch();
  const [chainUrl, setChainUrl] = useState(ReefChains.Testnet);

  const applyChanges = (): void => {
    dispatch(settingsSetChainUrl(chainUrl));
  }

  return (
    <Card>
      <CardTitle title="Settings" />

      <label className="ms-2 mb-2">Select network: </label>
      <select 
        className="form-select field-input"
        onChange={(event) => setChainUrl(event.target.value as ReefChains)}
        value={chainUrl}
      >
        <option value={ReefChains.Mainnet}>Reef Mainnet</option>
        <option value={ReefChains.Testnet}>Reef Testnet</option>
      </select>

      <button
        type="button"
        className="btn btn-reef mt-3 w-100"
        onClick={applyChanges}
      >
        Apply changes
      </button>
    </Card>
  );
}

export default Settings;
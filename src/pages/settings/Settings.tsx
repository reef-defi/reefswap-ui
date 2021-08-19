import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AvailableNetworks } from '../../api/rpc/rpc';
import Card, { CardTitle } from '../../components/card/Card';
import { settingsSetNetwork } from '../../store/actions/settings';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { SWAP_URL } from '../../utils/urls';

const Settings = (): JSX.Element => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { name } = useAppSelector((state) => state.settings);
  const [networkName, setNetworkName] = useState(name);

  const applyChanges = (): void => {
    dispatch(settingsSetNetwork(networkName));
    history.push(SWAP_URL);
  };

  return (
    <Card>
      <CardTitle title="Settings" />

      <label className="p-2 w-100" htmlFor="chain-selector">
        Select network:
        <select
          id="chain-selector"
          className="form-select field-input"
          onChange={(event) => setNetworkName(event.target.value as AvailableNetworks)}
          value={networkName}
        >
          <option value={'mainnet' as AvailableNetworks}>Reef Mainnet</option>
          <option value={'testnet' as AvailableNetworks}>Reef Testnet</option>
        </select>
      </label>

      <button
        type="button"
        className="btn btn-reef mt-3 w-100"
        onClick={applyChanges}
      >
        Apply changes
      </button>
    </Card>
  );
};

export default Settings;

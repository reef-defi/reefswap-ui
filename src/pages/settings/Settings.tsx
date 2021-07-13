import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ReefChains } from '../../api/api';
import Card, { CardTitle } from '../../components/card/Card';
import { settingsSetChainUrl } from '../../store/actions/settings';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { SWAP_URL } from '../../utils/urls';

const Settings = (): JSX.Element => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { chainUrl } = useAppSelector((state) => state.settings);
  const [url, setUrl] = useState<ReefChains>(chainUrl as ReefChains);

  const applyChanges = (): void => {
    dispatch(settingsSetChainUrl(url));
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
          onChange={(event) => setUrl(event.target.value as ReefChains)}
          value={url}
        >
          <option value={ReefChains.Mainnet}>Reef Mainnet</option>
          <option value={ReefChains.Testnet}>Reef Testnet</option>
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

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createEmptyToken } from '../../api/rpc/tokens';
import SelectToken from '../../components/buttons/SelectToken';
import Card, {
  CardBack, CardHeader, CardHeaderBlank, CardTitle,
} from '../../components/card/Card';
import { ReducerState } from '../../store';
import { POOL_URL } from '../../utils/urls';

const ImportPool = (): JSX.Element => {
  const history = useHistory();
  const back = (): void => history.push(POOL_URL);

  const { tokens } = useSelector((state: ReducerState) => state.tokens);

  const [token1, setToken1] = useState({ ...tokens[0] });
  const [token2, setToken2] = useState(createEmptyToken());

  const importPool = (): void => {
    history.push(POOL_URL);
  };

  return (
    <Card>
      <CardHeader>
        <CardBack onBack={back} />
        <CardTitle title="Import pool" />
        <CardHeaderBlank />
      </CardHeader>

      <div className="alert alert-danger mt-2 border-rad" role="alert">
        <b>Tip: </b>
        Use this tool to find pools that don not automatically appear in the interface.
      </div>

      <div className="row">
        <div className="col-6">
          <SelectToken
            fullWidth
            id="token1"
            iconUrl={token1.iconUrl}
            onTokenSelect={setToken1}
            selectedTokenName={token1.name}
          />
        </div>

        <div className="col-6">
          <SelectToken
            fullWidth
            id="token2"
            iconUrl={token2.iconUrl}
            onTokenSelect={setToken2}
            selectedTokenName={token2.name}
          />
        </div>
      </div>
      <button
        type="button"
        className="btn btn-reef btn-lg border-rad w-100 mt-3"
        onClick={importPool}
      >
        Import
      </button>
    </Card>
  );
};

export default ImportPool;

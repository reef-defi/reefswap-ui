import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SelectToken from '../../components/buttons/SelectToken';
import { CardWithBackTitle } from '../../components/card/Card';
import { ReducerState } from '../../store/reducers';
import { POOL_URL } from '../../utils/urls';

const ImportPool = (): JSX.Element => {
  const history = useHistory();
  const back = (): void => history.push(POOL_URL);

  const { tokens } = useSelector((state: ReducerState) => state.tokens);

  const [token1, setToken1] = useState({ ...tokens[0] });
  const [token2, setToken2] = useState({ ...tokens[1] });

  return (
    <CardWithBackTitle title="Import pool" onClick={back}>
      <div className="alert alert-danger mt-2 border-rad" role="alert">
        <b>Tip: </b>
        Use this tool to find pools that don not automatically appear in the interface.
      </div>

      <div className="row">
        <div className="col-6">
          <SelectToken
            fullWidth
            onTokenSelect={setToken1}
            selectedTokenName={token1.name}
          />
        </div>

        <div className="col-6">
          <SelectToken
            fullWidth
            onTokenSelect={setToken2}
            selectedTokenName={token2.name}
          />
        </div>
      </div>
      <button type="button" className="btn btn-reef border-rad w-100 mt-2">Import</button>
    </CardWithBackTitle>
  );
};

export default ImportPool;

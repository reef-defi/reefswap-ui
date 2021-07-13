import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SelectToken from '../../components/buttons/SelectToken';
import { CardWithBackTitle } from '../../components/card/Card';
import { ReducerState } from '../../store';
import { POOL_URL } from '../../utils/urls';

const ImportPool = (): JSX.Element => {
  const history = useHistory();
  const back = (): void => history.push(POOL_URL);

  const { tokens } = useSelector((state: ReducerState) => state.tokens);

  const [token1, setToken1] = useState(0);
  const [token2, setToken2] = useState(1);

  const name1 = tokens[token1].name;
  const name2 = tokens[token2].name;

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
            selectedTokenName={name1}
          />
        </div>

        <div className="col-6">
          <SelectToken
            fullWidth
            onTokenSelect={setToken2}
            selectedTokenName={name2}
          />
        </div>
      </div>
      <button type="button" className="btn btn-reef border-rad w-100 mt-2">Import</button>
    </CardWithBackTitle>
  );
};

export default ImportPool;

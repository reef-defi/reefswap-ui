import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SelectToken from '../../components/buttons/SelectToken';
import Card, {
  CardBack, CardHeader, CardHeaderBlank, CardTitle,
} from '../../components/card/Card';
import { ReducerState } from '../../store';
import { reloadPool } from '../../store/actions/pools';
import { useAppDispatch } from '../../store/hooks';
import { POOL_URL } from '../../utils/urls';

const ImportPool = (): JSX.Element => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const back = (): void => history.push(POOL_URL);

  const { tokens } = useSelector((state: ReducerState) => state.tokens);

  const [token1, setToken1] = useState(0);
  const [token2, setToken2] = useState(1);

  const name1 = tokens[token1].name;
  const name2 = tokens[token2].name;

  const importPool = () => {
    dispatch(reloadPool());
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
            onTokenSelect={setToken1}
            selectedTokenName={name1}
          />
        </div>

        <div className="col-6">
          <SelectToken
            fullWidth
            id="token2"
            onTokenSelect={setToken2}
            selectedTokenName={name2}
          />
        </div>
      </div>
      <button
        type="button"
        className="btn btn-reef border-rad w-100 mt-2"
        onClick={importPool}
      >Import</button>
    </Card>
  );
};

export default ImportPool;

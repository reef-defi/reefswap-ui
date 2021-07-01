import React from 'react';
import { useHistory } from 'react-router-dom';
import Card from '../../components/card/Card';
import { ADD_LIQUIDITY_URL, IMPORT_POOL_URL } from '../../utils/urls';

const PoolContoller = (): JSX.Element => {
  const history = useHistory();

  const onImportPoolClick = (): void => history.push(IMPORT_POOL_URL);
  const onAddLiquidityClick = (): void => history.push(ADD_LIQUIDITY_URL);

  return (
    <div>

      <div className="d-flex flex-row justify-content-between mx-2 mb-2">
        <h5 className="my-auto">Your liquidity</h5>
        <div>
          <button type="button" className="btn btn-reef border-rad" onClick={onImportPoolClick}>Import pool</button>
          <button type="button" className="btn btn-reef border-rad ms-1" onClick={onAddLiquidityClick}>Add liquidity</button>
        </div>
      </div>

      <Card>
        <ul />
      </Card>
    </div>
  );
};

export default PoolContoller;

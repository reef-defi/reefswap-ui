import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Card from '../../components/card/Card';
import { ReducerState } from '../../store/reducers';
import { ADD_LIQUIDITY_URL, IMPORT_POOL_URL } from '../../utils/urls';
import PoolItem from './PoolItem';

const PoolContoller = (): JSX.Element => {
  const history = useHistory();
  const {pools} = useSelector((state: ReducerState) => state.pools);

  const onImportPoolClick = (): void => history.push(IMPORT_POOL_URL);
  const onAddLiquidityClick = (): void => history.push(ADD_LIQUIDITY_URL);

  const poolsView = pools
    .map((pool) => 
      <li key={pool.address} className="list-item">
        <PoolItem {...pool} />
      </li>
    );

  return (
    <div>

      <div className="d-flex flex-row justify-content-between mx-2 mb-2">
        <h5 className="my-auto">Your liquidity</h5>
        <div>
          <button type="button" className="btn btn-reef border-rad" onClick={onImportPoolClick}>Import pool</button>
          <button type="button" className="btn btn-reef border-rad ms-1" onClick={onAddLiquidityClick}>Add liquidity</button>
        </div>
      </div>

      { pools.length 
        ? <ul className="list-group">
            {poolsView}
          </ul>
        : <div>No pool was found, you can import desired pool or add liquidity!</div>
      }
    </div>
  );
};

export default PoolContoller;

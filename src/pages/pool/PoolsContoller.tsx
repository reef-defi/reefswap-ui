import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { minimumRecieveAmount } from '../../utils/math';
import { ADD_LIQUIDITY_URL, IMPORT_POOL_URL } from '../../utils/urls';
import PoolManager from './PoolManager';

const PoolsContoller = (): JSX.Element => {
  const history = useHistory();
  const { pools } = useAppSelector((state) => state.pools);

  const onImportPoolClick = (): void => history.push(IMPORT_POOL_URL);
  const onAddLiquidityClick = (): void => history.push(ADD_LIQUIDITY_URL);

  const poolsView = pools
    .map(({
      token1, token2, userPoolBalance: liquidity, poolAddress, contract, totalSupply, reserve1, reserve2, decimals, minimumLiquidity
    }) => (
      <li key={poolAddress} className="list-item mt-2">
        <PoolManager
          token1={token1}
          token2={token2}
          decimals={decimals}
          contract={contract}
          reserve1={reserve1}
          reserve2={reserve2}
          totalSupply={totalSupply}
          poolAddress={poolAddress}
          userPoolBalance={liquidity}
          minimumLiquidity={minimumLiquidity}
        />
      </li>
    ));

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
        ? (
          <div className="row overflow-auto" style={{ maxHeight: '500px' }}>
            <ul className="list-group list-group-full col-12">
              {poolsView}
            </ul>
          </div>
        )
        : <div>No pool was found, you can import desired pool or add liquidity!</div>}
    </div>
  );
};

export default PoolsContoller;

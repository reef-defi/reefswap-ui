import React from 'react';
import { useHistory } from 'react-router-dom';
import { BigNumber } from 'ethers';
import { LoadingWithText } from '../../components/loading/Loading';
import { useAppSelector } from '../../store/hooks';
import { ADD_LIQUIDITY_URL, IMPORT_POOL_URL } from '../../utils/urls';
import PoolManager from './PoolManager';
import { useLoadPools } from '../../hooks/useLoadPools';

const PoolsContoller = (): JSX.Element => {
  const history = useHistory();
  const { tokens } = useAppSelector((state) => state.tokens);

  const onImportPoolClick = (): void => history.push(IMPORT_POOL_URL);
  const onAddLiquidityClick = (): void => history.push(ADD_LIQUIDITY_URL);

  const [pools, isLoading] = useLoadPools(tokens);

  const isFull = !isLoading && pools.length > 0;

  const poolsView = pools
    .filter(({ userPoolBalance }) => BigNumber.from(userPoolBalance).gt(0))
    .map(({
      token1, token2, userPoolBalance: liquidity, poolAddress, totalSupply, reserve1, reserve2, decimals, minimumLiquidity,
    }) => (
      <li key={poolAddress} className="list-item mt-2">
        <PoolManager
          token1={token1}
          token2={token2}
          decimals={decimals}
          reserve1={reserve1}
          reserve2={reserve2}
          totalSupply={totalSupply}
          poolAddress={poolAddress}
          userPoolBalance={liquidity}
          minimumLiquidity={minimumLiquidity}
        />
      </li>
    ));

  const isEmpty = !isLoading && poolsView.length === 0;

  return (
    <div>

      <div className="d-flex flex-row justify-content-between mx-2 mb-2">
        <h5 className="my-auto">Your liquidity</h5>
        <div>
          <button type="button" className="btn btn-reef border-rad" onClick={onImportPoolClick}>Import pool</button>
          <button type="button" className="btn btn-reef border-rad ms-1" onClick={onAddLiquidityClick}>Add liquidity</button>
        </div>
      </div>

      { isLoading && (
      <div className="mt-5">
        <LoadingWithText text="Loading pools..." />
      </div>
      )}
      { isEmpty && <div>No pool was found, you can import desired pool or add liquidity!</div> }
      { isFull
        && (
        <div className="row overflow-auto" style={{ maxHeight: '500px' }}>
          <ul className="list-group list-group-full col-12">
            {poolsView}
          </ul>
        </div>
        )}
    </div>
  );
};

export default PoolsContoller;

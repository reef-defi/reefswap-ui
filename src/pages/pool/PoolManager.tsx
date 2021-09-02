import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { BigNumber } from 'ethers';
import Card from '../../components/card/Card';
import { LoadingButtonIcon } from '../../components/loading/Loading';
import {
  InitialState, LoadingState, toInit,
} from '../../store/internalStore';
import { showBalance } from '../../utils/math';
import { ADD_LIQUIDITY_URL, REMOVE_LIQUIDITY_URL } from '../../utils/urls';
import { ReefswapPool } from '../../api/rpc/pools';

type PoolManagerState =
  | LoadingState
  | InitialState;

type PoolManager = ReefswapPool

const PoolManager = (pool : PoolManager): JSX.Element => {
  const history = useHistory();

  const [state, setState] = useState<PoolManagerState>(toInit());
  const [isOpen, setIsOpen] = useState(false);

  const {
    token1, token2, userPoolBalance: liquidity,
  } = pool;

  const addLiquidity = (): void => history.push(ADD_LIQUIDITY_URL);

  const onLiquidityRemove = (): void => history.push(
    REMOVE_LIQUIDITY_URL
      .replace(':address1', token1.address)
      .replace(':address2', token2.address),
  );

  return (
    <Card>
      <div className="d-flex justify-content-between">
        <span className="fw-bold my-auto">
          {token1.name}
          /
          {token2.name}
        </span>

        <button type="button" onClick={() => setIsOpen(!isOpen)} className="btn-empty nav-button">
          Manage
          <svg width="16" height="16" fill="currentColor" className="bi bi-chevron-down ms-1" viewBox="0 0 16 16">
            { isOpen
              ? <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z" />
              : <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />}
          </svg>
        </button>
      </div>
      {isOpen
        && (
        <div>
          <div className="d-flex justify-content-between mt-3">
            <label htmlFor="token-liquidity-amo" className="lead-text">Your pool tokens:</label>
            <span className="sub-text" id="token-liquidity-amo">
              {showBalance({ ...token1, balance: BigNumber.from(liquidity), decimals: 18 })}
            </span>
          </div>
          <div className="d-flex justify-content-between">
            <label htmlFor="token-balance-1" className="lead-text">
              {`Pooled ${token1.name}:`}
            </label>
            <span className="sub-text" id="token-balance-1">{showBalance(token1)}</span>
          </div>
          <div className="d-flex justify-content-between">
            <label htmlFor="token-balance-2" className="lead-text">
              {`Pooled ${token2.name}:`}
            </label>
            <span className="sub-text" id="token-balance-2">{showBalance(token2)}</span>
          </div>
          <div className="d-flex mt-3">
            <div className="w-50 px-1">
              <button
                type="button"
                className="btn btn-reef border-rad w-100"
                disabled={state._type === 'LoadingState'}
                onClick={addLiquidity}
              >
                {state._type === 'LoadingState'
                  ? <LoadingButtonIcon />
                  : 'Add liquidity'}
              </button>
            </div>
            <div className="w-50 px-1">
              <button
                type="button"
                className="btn btn-reef border-rad w-100"
                disabled={state._type === 'LoadingState'}
                onClick={onLiquidityRemove}
              >
                {state._type === 'LoadingState'
                  ? <LoadingButtonIcon />
                  : 'Remove liquidity'}
              </button>
            </div>
          </div>
        </div>
        )}
    </Card>
  );
};

export default PoolManager;

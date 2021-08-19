import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import Card from '../../components/card/Card';
import { LoadingButtonIcon } from '../../components/loading/Loading';
import {
  defaultGasLimit,
  InitialState, LoadingState, toInit, toLoading,
} from '../../store/internalStore';
import { showBalance } from '../../utils/math';
import { ADD_LIQUIDITY_URL } from '../../utils/urls';
import { reloadPool } from '../../store/actions/pools';
import { reloadTokensAction } from '../../store/actions/tokens';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { errorToast } from '../../utils/errorHandler';
import { ReefswapPool, removeLiquidity } from '../../api/rpc/pools';

type PoolManagerState =
  | LoadingState
  | InitialState;

type PoolManager = ReefswapPool

const PoolManager = (pool : PoolManager): JSX.Element => {
  const history = useHistory();
  const dispatch = useAppDispatch();

  const settings = useAppSelector((state) => state.settings);
  const { accounts, selectedAccount } = useAppSelector((state) => state.accounts);

  const [state, setState] = useState<PoolManagerState>(toInit());
  const [gasLimit] = useState(defaultGasLimit());
  const [isOpen, setIsOpen] = useState(false);

  const { token1, token2, liquidity } = pool;

  const addLiquidity = (): void => history.push(ADD_LIQUIDITY_URL);

  const onLiquidityRemove = async (): Promise<void> => {
    try {
      setState(toLoading());
      const { signer } = accounts[selectedAccount];
      await removeLiquidity(pool, signer, gasLimit, settings);
      toast.success('Liquidity removed successfully!');
      dispatch(reloadPool());
      dispatch(reloadTokensAction());
    } catch (error) {
      errorToast(error.message);
      setState(toInit());
    }
  };

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
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down ms-1" viewBox="0 0 16 16">
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
              {showBalance({ ...token1, balance: liquidity, decimals: 18 })}
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
                className="btn btn-reef w-100"
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
                className="btn btn-reef w-100"
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

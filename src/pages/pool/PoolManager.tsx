import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useHistory } from "react-router-dom";
import { ReefswapPool, removeLiquidity } from "../../api/pools";
import Card from "../../components/card/Card";
import { LoadingButtonIcon } from "../../components/loading/Loading";
import { InitialState, LoadingState, toInit, toLoading } from "../../store/internalStore";
import { showBalance } from "../../utils/math";
import { ADD_LIQUIDITY_URL } from "../../utils/urls";
import { useDispatch, useSelector } from "react-redux";
import { ReducerState } from "../../store/reducers";
import { ensure } from "../../utils/utils";
import { reloadPool } from "../../store/actions/pools";


type PoolManagerState =
  | LoadingState
  | InitialState;

interface PoolManager extends ReefswapPool {}

const PoolManager = ({liquidity, token1, token2} : PoolManager): JSX.Element => {
  const history = useHistory();
  const dispatch = useDispatch();

  const {accounts, selectedAccount} = useSelector((state: ReducerState) => state.accounts);

  const [state, setState] = useState<PoolManagerState>(toInit());
  const [isOpen, setIsOpen] = useState(false);

  const addLiquidity = () => history.push(ADD_LIQUIDITY_URL);

  const onLiquidityRemove = async () => {
    try {
      setState(toLoading());
      ensure(selectedAccount !== -1, "No account selected!");
      const {signer} = accounts[selectedAccount];
      await removeLiquidity(token1, token2, liquidity, signer);

      toast.success("Liquidity removed successfully!");
      dispatch(reloadPool());
    } catch (error) {
      toast.error(error.message ? error.message : error);
    } finally {
      setState(toInit());
    }
  }

  return (
    <Card>
      <div className="d-flex justify-content-between">
        <span className="fw-bold">{token1.name}/{token2.name}</span>

        <a type="button" onClick={() => setIsOpen(!isOpen)} className="nav-button noselect">
          Manage
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down ms-1" viewBox="0 0 16 16">
            { isOpen 
              ? <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
              : <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
            }
          </svg>
        </a>
      </div> 
      {isOpen &&
        <div>
          <div className="d-flex justify-content-between mt-3">
            <label>Your pool tokens:</label>
            <span className="balance-span">{showBalance({...token1, balance: liquidity, decimals: 18})}</span>
          </div>
          <div className="d-flex justify-content-between">
            <label>Pooled {token1.name}:</label>
            <span className="balance-span">{showBalance(token1)}</span>
          </div>
          <div className="d-flex justify-content-between">
            <label>Pooled {token2.name}:</label>
            <span className="balance-span">{showBalance(token2)}</span>
          </div>
          <div className="d-flex mt-3">
            <div className="w-50 px-1">
              <button
                type="button"
                className="btn btn-reef w-100"
                disabled={state._type === "LoadingState"}
                onClick={addLiquidity}
                >
                {state._type === "LoadingState" 
                  ? <LoadingButtonIcon /> 
                  : "Add liquidity"
                }
              </button>
            </div>
            <div className="w-50 px-1">
              <button
                type="button"
                className="btn btn-reef w-100"
                disabled={state._type === "LoadingState"}
                onClick={onLiquidityRemove}
              >
                {state._type === "LoadingState"
                  ? <LoadingButtonIcon />
                  : "Remove liquidity"
                }
              </button>
            </div>
          </div>
        </div>
      }
    </Card>
  );
}

export default PoolManager;
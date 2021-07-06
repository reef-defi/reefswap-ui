import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom";
import { ReefswapPool } from "../../api/pools";
import Card from "../../components/card/Card";
import { showBalance } from "../../utils/math";
import { ADD_LIQUIDITY_URL } from "../../utils/urls";

interface PoolManager extends ReefswapPool {}

const PoolManager = ({liquidity, token1, token2} : PoolManager): JSX.Element => {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);

  const addLiquidity = () => history.push(ADD_LIQUIDITY_URL);

  return (
    <Card>
      <div className="d-flex justify-content-between">
        <div>{token1.name}/{token2.name}</div>

        <a type="button" onClick={() => setIsOpen(!isOpen)}>Manage</a>
      </div> 
      <div hidden={!isOpen}>
        <div className="d-flex justify-content-between mt-3">
          <label>Your pool tokens:</label>
          <label>{showBalance({...token1, balance: liquidity, decimals: 18}, 7)}</label>
        </div>
        <div className="d-flex justify-content-between mt-1">
          <label>Pooled {token1.name}:</label>
          <label>{showBalance(token1, 7)}</label>
        </div>
        <div className="d-flex justify-content-between mt-1">
          <label>Pooled {token2.name}:</label>
          <label>{showBalance(token2, 7)}</label>
        </div>
        <div className="d-flex mt-3">
          <div className="w-50 px-1">
            <button type="button" className="btn btn-reef w-100" onClick={addLiquidity}>Add liquidity</button>
          </div>
          <div className="w-50 px-1">
            <button type="button" className="btn btn-reef w-100">Remove liquidity</button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default PoolManager;
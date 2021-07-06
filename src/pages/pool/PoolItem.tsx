import React, { useEffect, useState } from "react"
import { ReefswapPool } from "../../api/pools";
import Card from "../../components/card/Card";
import { calculateAmount, showBalance } from "../../utils/math";

interface PoolItem extends ReefswapPool {}

const PoolItem = ({contract, liquidity, token1, token2} : PoolItem): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  console.log(contract);

  return (
    <Card>
      <div className="d-flex justify-content-between">
        <div>{token1.name}/{token2.name}</div>

        <a type="button" onClick={() => setIsOpen(!isOpen)}>Manage</a>
      </div> 
      <div hidden={!isOpen}>
        <div className="d-flex justify-content-between">
          <label>Your pool tokens:</label>
          <label>{showBalance({...token1, balance: liquidity, decimals: 18}, 2)}</label>
        </div>
        <div className="d-flex justify-content-between">
          <label>Pooled {token1.name}:</label>
          <label>{showBalance(token1, 7)}</label>
        </div>
        <div className="d-flex justify-content-between">
          <label>Pooled {token2.name}:</label>
          <label>{showBalance(token2, 7)}</label>
        </div>
      </div>
    </Card>
  );
}

export default PoolItem;
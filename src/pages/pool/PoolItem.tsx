import React, { useState } from "react"
import { ReefswapPool } from "../../api/pools";
import Card from "../../components/card/Card";

interface PoolItem extends ReefswapPool {}

const PoolItem = ({address, contract, signerBalance, token1, token2} : PoolItem): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Card>
      <div className="d-flex justify-content-between">
        <div>{token1.name}/{token2.name}</div>

        <a type="button" onClick={() => setIsOpen(!isOpen)}>Manage</a>
      </div> 
      <div hidden={!isOpen}>
        content
      </div>
    </Card>
  );
}

export default PoolItem;
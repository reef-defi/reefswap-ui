import React, { useState } from "react"
import Card, { CardTitle } from "../../components/card/Card";
import TokenAmountField from "../../components/card/TokenAmountField";
import { defaultReefToken, defaultRUSDToken } from "../../store/reducers/tokens";

interface SwapControllerProps {

}

const SwapController = ({} : SwapControllerProps) => { 
  const [token1, setToken1] = useState({...defaultReefToken});
  const [token2, setToken2] = useState({...defaultRUSDToken});

  const [amount1, setAmount1] = useState(0.0);
  const [amount2, setAmount2] = useState(0.0);

  const onSwitch = () => {
    const subAmount = amount1;
    const subToken = token1;
    setToken1(token2);
    setToken2(subToken);
    setAmount1(amount2);
    setAmount2(subAmount);
  }

  return (
    <Card>
      <CardTitle title="Swap" />
      <TokenAmountField
        amount={amount1}
        token={token1}
        onAmountChange={setAmount1}
        onTokenSelect={setToken1}
      />
      <div className="d-flex justify-content-center">
        <div className="btn-content-field border-rad">
          <button className="btn btn-field border-rad hover-border" onClick={onSwitch}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-down-short" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/>
            </svg>
          </button>
        </div>
      </div>
      <TokenAmountField
        amount={amount2}
        token={token2}
        onAmountChange={setAmount2}
        onTokenSelect={setToken2}
      />
      <div className="d-flex justify-content-center mt-2">
        <button className="btn btn-reef border-rad w-100">Swap</button>
      </div>
    </Card>
  );
}

export default SwapController;
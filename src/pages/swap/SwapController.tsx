import React, { useState } from "react"
import Card, { CardTitle } from "../../components/card/Card";
import TokenAmountField from "../../components/card/TokenAmountField";
import { Token, TokenWithAmount } from "../../store/actions/tokens";
import { defaultReefToken, defaultRUSDToken } from "../../store/reducers/tokens";

interface SwapControllerProps {

}

const SwapController = ({} : SwapControllerProps) => { 
  const [token1, setToken1] = useState<TokenWithAmount>({...defaultReefToken, amount: ""});
  const [token2, setToken2] = useState<TokenWithAmount>({...defaultRUSDToken, amount: ""});

  const setAmount1 = (amount: string) => setToken1({...token1, amount});
  const setAmount2 = (amount: string) => setToken2({...token1, amount});

  const changeToken1 = (token: Token) => setToken1({...token, amount: ""});
  const changeToken2 = (token: Token) => setToken2({...token, amount: ""});

  const onSwitch = () => {
    const subToken = {...token1};
    setToken1({...token2});
    setToken2({...subToken});
  }

  return (
    <Card>
      <CardTitle title="Swap" />
      <TokenAmountField
        token={token1}
        onAmountChange={setAmount1}
        onTokenSelect={changeToken1}
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
        token={token2}
        onAmountChange={setAmount2}
        onTokenSelect={changeToken2}
      />
      <div className="d-flex justify-content-center mt-2">
        <button className="btn btn-reef border-rad w-100">Swap</button>
      </div>
    </Card>
  );
}

export default SwapController;
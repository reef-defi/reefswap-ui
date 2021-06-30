import React, { useState } from "react"
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Token } from "../../../api/tokens";
import { CardWithBackTitle } from "../../../components/card/Card";
import TokenAmountField from "../../../components/card/TokenAmountField";
import { TokenWithAmount } from "../../../store/actions/tokens";
import { ReducerState } from "../../../store/reducers";
import { POOL_URL } from "../../../utils/urls";

interface AddLiquidityProps {

}

const AddLiquidity = ({} : AddLiquidityProps) => {
  const {tokens} = useSelector((state: ReducerState) => state.tokens);
  const history = useHistory();
  const back = () => history.push(POOL_URL);

  const [token1, setToken1] = useState<TokenWithAmount>({...tokens[0], amount: ""});
  const [token2, setToken2] = useState<TokenWithAmount>({...tokens[1], amount: ""});

  const changeToken1 = (token: Token) => setToken1({...token, amount: ""});
  const changeToken2 = (token: Token) => setToken2({...token, amount: ""});

  const setAmount1 = (amount: string) => setToken1({...token1, amount});
  const setAmount2 = (amount: string) => setToken2({...token2, amount});

  return (
    <CardWithBackTitle title="Add liquidity" onClick={back}>
      <div className="alert alert-danger mt-2 border-rad" role="alert">
        <b>Tip: </b>
        When you add liquidity, you will receive pool tokens representing your position. These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time.
      </div>

      <TokenAmountField
        token={token1}
        onTokenSelect={changeToken1}
        onAmountChange={setAmount1}
      />
      <div className="d-flex justify-content-center">
        <div className="btn-content-field border-rad">
          <button disabled className="btn btn-field">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
          </button>
        </div>
      </div>

      <TokenAmountField
        token={token2}
        onTokenSelect={changeToken2}
        onAmountChange={setAmount2}
      />

      <button className="btn btn-reef border-rad w-100 mt-2">
        Add liquidity
      </button>
    </CardWithBackTitle>
  );
}

export default AddLiquidity;
import React from "react"
import { useHistory } from "react-router-dom";
import Card, { CardWithBackTitle } from "../../../components/card/Card";
import { POOL_URL } from "../../../urls";
import LiquidityField from "./LiquidityField";

interface AddLiquidityProps {

}

const AddLiquidity = ({} : AddLiquidityProps) => {
  const history = useHistory();
  const back = () => history.push(POOL_URL);

  return (
    <CardWithBackTitle title="Add liquidity" onClick={back}>
      <div className="alert alert-danger mt-2 border-rad" role="alert">
        <b>Tip: </b>
        When you add liquidity, you will receive pool tokens representing your position. These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time.
      </div>

      <LiquidityField />
      <div className="d-flex justify-content-center">
        <div className="btn-content-field border-rad">
          <button disabled className="btn btn-field">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
          </button>
        </div>
      </div>
      <LiquidityField />

      <button className="btn btn-reef border-rad w-100 mt-2">
        Add liquidity
      </button>
    </CardWithBackTitle>
  );
}

export default AddLiquidity;
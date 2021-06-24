import React from "react"
import { useHistory } from "react-router-dom";
import Card from "../../../components/card/Card";
import { POOL_URL } from "../../../urls";
import LiquidityField from "./LiquidityField";

interface AddLiquidityProps {

}

const AddLiquidity = ({} : AddLiquidityProps) => {
  const history = useHistory();
  const back = () => history.push(POOL_URL);

  return (
    <Card>
      <div className="d-flex justify-content-between">
        <button className="btn" onClick={back}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
        </svg>
        </button>
        <h5 className="my-auto">Add liquidity</h5>
        <div style={{width: "46px"}} />
      </div>
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
    </Card>
  );
}

export default AddLiquidity;
import React from "react"
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { createEmptyTokenWithAmount } from "../../api/rpc/tokens";
import Card, { CardBack, CardHeader, CardTitle } from "../../components/card/Card"
import { CardSettings } from "../../components/card/CardSettings"
import { DownIcon } from "../../components/card/Icons";
import { ConfirmLabel } from "../../components/label/Labels";
import { FindOrLoadTokenHook } from "../../hooks/findOrLoadTokenHook";
import { LoadPoolHook } from "../../hooks/loadPoolHook";
import { defaultSettings } from "../../store/internalStore";
import { calculatePoolRatio, removePoolTokenShare } from "../../utils/math";
import { POOL_URL } from "../../utils/urls";

interface UrlParams {
  address1: string;
  address2: string;
}

const nameCorrector = (name: string) =>
  name === "Select token" ? "-" : name;

const RemoveLiquidity = (): JSX.Element => {
  const history = useHistory();
  const {address1, address2} = useParams<UrlParams>();

  const [token1, isToken1Loading] = FindOrLoadTokenHook(address1);
  const [token2, isToken2Loading] = FindOrLoadTokenHook(address2);

  const {pool, isPoolLoading } = LoadPoolHook(token1, token2);

  const back = () => history.push(POOL_URL);

  const [settings, setSettings] = useState(defaultSettings());
  const [percentageAmount, setPercentageAmount] = useState(0);

  return (
    <Card>
      <CardHeader>
        <CardBack onBack={back} />
        <CardTitle title="Remove Liquidity" />
        <CardSettings settings={settings} setSettings={setSettings} />
      </CardHeader>
      <div className="alert alert-danger mt-2 border-rad user-select-none" role="alert">
        <b>Tip: </b>
        Removing pool tokens converts your position back into underlying tokens at the current rate, proportional to your share of the pool. Accrued fees are included in the amounts you receive.
      </div>
      <div className="field border-rad p-3">
        <span>Remove Amount</span>
        <h1 className="display-3 user-select-none">{percentageAmount} %</h1>
        <input
          min={0}
          max={100} 
          type="range"
          className="form-range"
          value={percentageAmount}
          disabled={!pool}
          onChange={(event) => setPercentageAmount(parseInt(event.target.value, 10))}
        />
        <div className="d-flex justify-content-between mx-3 mt-2">
          <button type="button" className="btn btn-reef border-rad" onClick={() => setPercentageAmount(25)}>25%</button>
          <button type="button" className="btn btn-reef border-rad" onClick={() => setPercentageAmount(50)}>50%</button>
          <button type="button" className="btn btn-reef border-rad" onClick={() => setPercentageAmount(75)}>75%</button>
          <button type="button" className="btn btn-reef border-rad" onClick={() => setPercentageAmount(100)}>Max</button>
        </div>
      </div>
      <div className="d-flex justify-content-center my-2">
        <DownIcon />
      </div>
      <div className="field border-rad p-3">
        <ConfirmLabel title={removePoolTokenShare(percentageAmount, pool?.token1).toFixed(8)} value={nameCorrector(token1.name)} size="title-text" />
        <ConfirmLabel title={removePoolTokenShare(percentageAmount, pool?.token2).toFixed(8)} value={nameCorrector(token2.name)} size="title-text" />
      </div>
      <div className="my-2 mx-4">
        <ConfirmLabel title="Price" value={`1 ${nameCorrector(token1.name)} = ${calculatePoolRatio(pool).toFixed(8)} ${nameCorrector(token2.name)}`} />
        <ConfirmLabel title="" value={`1 ${nameCorrector(token2.name)} = ${calculatePoolRatio(pool, false).toFixed(8)} ${nameCorrector(token1.name)}`} />
      </div>
      
      <button
        type="button"
        className="btn btn-lg btn-reef border-rad w-100 mt-2"
        // disabled={!isValid || isLoading}
        data-bs-toggle="modal"
        data-bs-target="#supplyModalToggle"
      >
        Confirm remove
        {/* {isLoading ? <LoadingButtonIconWithText text={status} /> : text} */}
      </button>
    </Card>
  );
}

export default RemoveLiquidity;
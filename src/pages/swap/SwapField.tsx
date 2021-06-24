import React from "react"
import SelectToken from "../../components/buttons/SelectToken";

interface SwapFieldProps {

}

const SwapField = ({} : SwapFieldProps) => {
  return (
    <div className="swap-field p-3 border-rad">
      <div className="d-flex mb-2">
        <SelectToken />
        <input
          type="number"
          min={0}
          max={1000}
          placeholder="0.0"
          className="swap-input-field ms-2 flex-grow-1 text-end"
        />
      </div>
      <small className="ms-2">Balance: 1000 REEF</small>
    </div>
  );
}

export default SwapField;
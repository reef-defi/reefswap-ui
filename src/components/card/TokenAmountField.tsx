import React from "react"
import SelectToken from "../../components/buttons/SelectToken";
import { Token, TokenWithAmount } from "../../store/actions/tokens";

interface TokenAmountFieldProps {
  token: TokenWithAmount;
  onTokenSelect: (token: Token) => void;
  onAmountChange: (amount: string) => void;
}

const TokenAmountField = ({token, onTokenSelect, onAmountChange} : TokenAmountFieldProps) => {
  const {name, amount} = token;

  return (
    <div className="field p-3 border-rad">
      <div className="d-flex mb-2">
        <SelectToken 
          onTokenSelect={onTokenSelect}
          selectedTokenName={name}
        />
        <input
          type="number"
          value={amount}
          min={0}
          max={1000}
          placeholder="0.0"
          className="field-input ms-2 flex-grow-1 text-end"
          onChange={(event) => onAmountChange(event.target.value)}
        />
      </div>
      <small className="ms-2">Balance: 1000 {name}</small>
    </div>
  );
}

export default TokenAmountField;
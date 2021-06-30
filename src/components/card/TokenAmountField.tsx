import React from "react"
import { Token } from "../../api/tokens";
import SelectToken from "../../components/buttons/SelectToken";
import { TokenWithAmount } from "../../store/actions/tokens";
import { calculateBalance } from "../../utils/math";

interface TokenAmountFieldProps {
  token: TokenWithAmount;
  onTokenSelect: (token: Token) => void;
  onAmountChange: (amount: string) => void;
}

const TokenAmountField = ({token, onTokenSelect, onAmountChange} : TokenAmountFieldProps) => {
  const {name, amount, balance} = token;

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
      <small className="ms-2">Balance: {calculateBalance(token)} {name}</small>
    </div>
  );
}

export default TokenAmountField;
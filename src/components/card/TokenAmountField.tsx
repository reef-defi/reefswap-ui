import React, { useEffect, useState } from 'react';
import SelectToken from '../buttons/SelectToken';
import { showBalance } from '../../utils/math';
import { TokenWithAmount } from '../../api/rpc/tokens';

interface TokenAmountFieldProps {
  id?: string;
  token: TokenWithAmount;
  onTokenSelect: (index: number) => void;
  onAmountChange: (amount: string) => void;
  placeholder?: string;
}

const TokenAmountField = ({
  id = 'exampleModal', token, onTokenSelect, onAmountChange, placeholder = '0,0',
} : TokenAmountFieldProps): JSX.Element => {
  const { name, amount, price } = token;
  const amt = parseFloat(amount);

  return (
    <div className="field p-3 border-rad">
      <div className="d-flex mb-2">
        <SelectToken
          id={id}
          onTokenSelect={onTokenSelect}
          selectedTokenName={name}
        />
        <input
          type="number"
          value={amount}
          min={0}
          max={1000}
          placeholder={placeholder}
          className="field-input ms-2 flex-grow-1 text-end"
          onChange={(event) => onAmountChange(event.target.value)}
        />
      </div>
      <div className="d-flex justify-content-between mx-2">
        <small>
          Balance: {`${showBalance(token)}`}
        </small>
        <small>
          {price !== 0 && amount !== "" && `~$: ${(amt * price).toFixed(3)}`}
        </small>
      </div>
    </div>
  );
};

export default TokenAmountField;

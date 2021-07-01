import React from 'react';
import { Token, TokenWithAmount } from '../../api/tokens';
import SelectToken from '../buttons/SelectToken';
import { calculateBalance } from '../../utils/math';

interface TokenAmountFieldProps {
  id?: string;
  token: TokenWithAmount;
  onTokenSelect: (token: Token) => void;
  onAmountChange: (amount: string) => void;
  placeholder?: string;
}

const TokenAmountField = ({
  id, token, onTokenSelect, onAmountChange, placeholder = '0,0',
} : TokenAmountFieldProps): JSX.Element => {
  const { name, amount } = token;

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
      <small className="ms-2">
        Balance:
        {calculateBalance(token)}
        {' '}
        {name}
      </small>
    </div>
  );
};

TokenAmountField.defaultProps = {
  id: 'exampleModal',
  placeholder: '0,0',
};

export default TokenAmountField;

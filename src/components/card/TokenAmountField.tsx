import React from 'react';
import SelectToken from '../buttons/SelectToken';
// import { showBalance } from '../../utils/math';
import { Token, TokenWithAmount } from '../../api/rpc/tokens';
import { showBalance } from '../../utils/math';

interface TokenAmountFieldProps {
  id?: string;
  token: TokenWithAmount;
  onTokenSelect: (newToken: Token) => void;
  onAmountChange: (amount: string) => void;
  placeholder?: string;
}

const TokenAmountField = ({
  id = 'exampleModal', token, onTokenSelect, onAmountChange, placeholder = '0,0',
} : TokenAmountFieldProps): JSX.Element => {
  const {
    name, isEmpty, amount, price, iconUrl,
  } = token;
  const amo = parseFloat(amount);

  return (
    <div className="field p-3 border-rad">
      <div className="d-flex mb-2">
        <SelectToken
          id={id}
          isEmpty={isEmpty}
          selectedTokenName={name}
          iconUrl={iconUrl}
          onTokenSelect={onTokenSelect}
        />
        <input
          type="number"
          min={0}
          disabled={isEmpty}
          value={isEmpty ? '' : amount}
          placeholder={isEmpty ? '' : placeholder}
          className="field-input ms-2 flex-grow-1 text-end"
          onChange={(event) => onAmountChange(event.target.value)}
        />
      </div>
      <div className="d-flex justify-content-between mx-2">
        <small>
          {!isEmpty && `Balance: ${showBalance(token)}`}
        </small>
        <small>
          {!isEmpty && price !== 0 && amount !== '' && `~$ ${(amo * price).toFixed(4)}`}
        </small>
      </div>
    </div>
  );
};

export default TokenAmountField;

import React from 'react';
import SelectToken from '../buttons/SelectToken';
import { Token, TokenWithAmount } from '../../api/rpc/tokens';
import { showBalance, toBalance } from '../../utils/math';
import { InputAmount } from '../inputs/Inputs';



interface TokenAmountFieldProps {
  id?: string;
  token: TokenWithAmount;
  onTokenSelect: (newToken: Token) => void;
  onAmountChange: (amount: string) => void;
  placeholder?: string;
}

const TokenAmountFieldBase: React.FC<TokenAmountFieldProps> = ({
  id = 'exampleModal', token, onTokenSelect, onAmountChange, placeholder = '0,0', children,
}): JSX.Element => {
  const {
    name, isEmpty, amount, iconUrl,
  } = token;

  return (
    <div className="field p-3 border-rad">
      <div className="d-flex mb-2">
        <SelectToken
          id={id}
          selectedTokenName={name}
          iconUrl={iconUrl}
          onTokenSelect={onTokenSelect}
        />
        <InputAmount
          disabled={isEmpty}
          amount={amount}
          placeholder={placeholder}
          onAmountChange={onAmountChange}
        />
      </div>
      <div className="d-flex justify-content-between mx-2">
        {children}
      </div>
    </div>
  );
};

const TokenAmountField = ({id, token, placeholder, onTokenSelect, onAmountChange}: TokenAmountFieldProps) => {
  const {amount, price, isEmpty} = token;
  const amo = parseFloat(amount);

  return (
    <TokenAmountFieldBase
      id={id}
      token={token}
      placeholder={placeholder}
      onTokenSelect={onTokenSelect}
      onAmountChange={onAmountChange}
    >
      <small>
        {!isEmpty && `Balance: ${showBalance(token)}`}
      </small>
      <small>
        {!isEmpty && price !== 0 && amount !== '' && `~$ ${(amo * price).toFixed(4)}`}
      </small>
    </TokenAmountFieldBase>
  );
}

export default TokenAmountField;


export const TokenAmountFieldMax = ({id, token, placeholder, onTokenSelect, onAmountChange}: TokenAmountFieldProps) => {
  const {amount, price, isEmpty} = token;
  const amo = parseFloat(amount);

  return (
    <TokenAmountFieldBase
      id={id}
      token={token}
      placeholder={placeholder}
      onTokenSelect={onTokenSelect}
      onAmountChange={onAmountChange}
    >
      <small>
        {!isEmpty && `Balance: ${showBalance(token)}`}
        {!isEmpty && <a className="text-primary text-decoration-none" onClick={() => onAmountChange(toBalance(token)+"")}>(Max)</a>}
      </small>
      <small>
        {!isEmpty && price !== 0 && amount !== '' && `~$ ${(amo * price).toFixed(4)}`}
      </small>
    </TokenAmountFieldBase>
  );
}

interface TokenAmountFieldImpactPriceProps extends TokenAmountFieldProps {
  percentage: number;
}

const PercentageView = ({percentage}: {percentage: number}): JSX.Element => {
  var color = "";
  if (percentage > 0) { color = "text-success"; }
  else if (percentage < 5) { color = "text-warning"; }
  else { color = "text-danger"; }
  return (
    <span className={color}>({`${(percentage*100).toFixed(3)} %`})</span>
  )
}

export const TokenAmountFieldImpactPrice = ({id, token, placeholder, percentage, onTokenSelect, onAmountChange}: TokenAmountFieldImpactPriceProps) => {
  const {amount, price, isEmpty} = token;
  const amo = parseFloat(amount);

  const showUsd = !isEmpty && price !== 0 && amount !== '';

  return (
    <TokenAmountFieldBase
      id={id}
      token={token}
      placeholder={placeholder}
      onTokenSelect={onTokenSelect}
      onAmountChange={onAmountChange}
    >
      <small>
        {!isEmpty && `Balance: ${showBalance(token)}`}
      </small>
      <small>
        {showUsd && `~$ ${(amo * price).toFixed(4)} `}
        {showUsd && <PercentageView percentage={percentage} />}
      </small>
    </TokenAmountFieldBase>
  );
}
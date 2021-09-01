import React from 'react';

interface TokenAmountView {
  name: string;
  amount: string;
  usdAmount: number;
  placeholder: string;
}

const TokenAmountView = ({
  placeholder, name, amount, usdAmount,
} : TokenAmountView): JSX.Element => (
  <div className="field p-3 border-rad">
    <div className="d-flex justify-content-between">
      <span className="text-muted sub-text">{placeholder}</span>
      <span className="sub-text">{`~$ ${usdAmount.toFixed(4)}`}</span>
    </div>
    <div className="d-flex justify-content-between mt-1">
      <span className="title-text">{name}</span>
      <span className="title-text">{amount}</span>
    </div>
  </div>
);

export default TokenAmountView;

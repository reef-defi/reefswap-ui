import React from 'react';

interface InputAmount {
  amount: string;
  disabled?: boolean;
  placeholder?: string;
  onAmountChange: (value: string) => void;
}

export const InputAmount = ({
  amount, onAmountChange, placeholder = '', disabled = false,
} : InputAmount): JSX.Element => (
  <input
    type="number"
    min={0.0}
    disabled={disabled}
    value={disabled ? '' : amount.replaceAll(',', '.')}
    placeholder={placeholder}
    className="field-input ms-2 flex-grow-1 text-end"
    onChange={(event) => onAmountChange(event.target.value)}
  />
);

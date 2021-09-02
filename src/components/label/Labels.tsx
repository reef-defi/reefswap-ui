import React from 'react';

interface ConfirmLabel {
  title: string;
  value: string;
  titleSize?: string;
  valueSize?: string;
}

export const ConfirmLabel = ({
  title, value, titleSize = 'sub-text', valueSize = 'sub-text',
} : ConfirmLabel): JSX.Element => (
  <div className="d-flex justify-content-between my-1">
    <span className={`text-muted my-auto ${titleSize}`}>{title}</span>
    <span className={`${valueSize} my-auto`}>{value}</span>
  </div>
);

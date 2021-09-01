import React from "react"

interface ConfirmLabel {
  title: string;
  value: string;
  size?: string;
}

export const ConfirmLabel = ({title, value, size="sub-text"} : ConfirmLabel): JSX.Element => (
  <div className="d-flex justify-content-between my-1">
    <span className={`text-muted ${size}`}>{title}</span>
    <span className={size}>{value}</span>
  </div>
);

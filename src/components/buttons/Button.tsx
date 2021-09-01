import React from "react";
import { DownArrowIcon, PlusIcon } from "../card/Icons";

export interface ButtonStatus {
  text: string;
  isValid: boolean;
}

// TODO add button common component!

interface SwitchTokenButton {
  addIcon?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const SwitchTokenButton = ({addIcon, disabled, onClick}: SwitchTokenButton) => (
  <div className="d-flex justify-content-center">
    <div className="btn-content-field border-rad">
      <button type="button" className="btn btn-field border-rad hover-border" onClick={onClick} disabled={disabled}>
        { addIcon ? <PlusIcon /> : <DownArrowIcon /> }
      </button>
    </div>
  </div>
);
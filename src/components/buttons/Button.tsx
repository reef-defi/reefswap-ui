import React from 'react';
import { DownArrowIcon, PlusIcon } from '../card/Icons';

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

export const SwitchTokenButton = ({ addIcon, disabled, onClick }: SwitchTokenButton): JSX.Element => (
  <div className="d-flex justify-content-center">
    <div className="btn-content-field border-rad">
      <button type="button" className="btn btn-field border-rad hover-border" onClick={onClick} disabled={disabled}>
        { addIcon ? <PlusIcon /> : <DownArrowIcon /> }
      </button>
    </div>
  </div>
);

interface IconButton {
  onClick?: () => void;
}

export const IconButton: React.FC<IconButton> = ({ onClick, children }): JSX.Element => (
  <button type="button" className="btn btn-select border-rad px-2 py-1" onClick={onClick} data-bs-dismiss="modal">
    {children}
  </button>
);

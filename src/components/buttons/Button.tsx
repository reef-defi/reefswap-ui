import React from 'react';
import { Link } from 'react-router-dom';
import { DownArrowIcon, PlusIcon } from '../card/Icons';

export interface ButtonStatus {
  text: string;
  isValid: boolean;
}

interface SwitchTokenButton {
  addIcon?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

interface IconButton {
  onClick?: () => void;
}

interface NavButtonProps {
  to: string;
  name: string;
  selected: boolean;
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

export const IconButton: React.FC<IconButton> = ({ onClick, children }): JSX.Element => (
  <button type="button" className="btn btn-select border-rad px-2 py-1" onClick={onClick} data-bs-dismiss="modal">
    {children}
  </button>
);

export const NavButton = ({ to, name, selected = false }: NavButtonProps): JSX.Element => (
  <Link to={to} className={`border-rad h-100 fs-6 fw-bold px-3 py-2 ${selected ? 'nav-selected' : 'nav-button'}`}>{name}</Link>
);

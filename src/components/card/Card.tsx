import React from 'react';
import './Card.css';
import { BackIcon, GearIcon } from './Icons';

const Card: React.FC = ({ children }): JSX.Element => (
  <div className="card border-rad">
    <div className="card-body">
      {children}
    </div>
  </div>
);

export default Card;

export const CardHeader: React.FC<unknown> = ({ children }) => (
  <div className="d-flex justify-content-between mb-2">
    { children }
  </div>
);

export const CardHeaderBlank = (): JSX.Element => (
  <div style={{ width: '46px' }} />
);

interface CardTitle {
  title: string;
}

export const CardTitle: React.FC<CardTitle> = ({ title }): JSX.Element => (
  <h5 className="h5 my-2 text-center">{title}</h5>
);

interface CardBack {
  onBack: () => void;
}

export const CardBack = ({ onBack }: CardBack): JSX.Element => (
  <button type="button" className="btn" onClick={onBack}>
    <BackIcon />
  </button>
);

interface Settings {
  gasLimit: string;
  setGasLimit: (value: string) => void;
}
interface CardSettings {
  id?: string;
  settings: Settings;
}

export const CardSettings: React.FC<CardSettings> = ({ settings, id = 'settings' }) => (
  <div className="btn-group">
    <button className="btn" type="button" id={id} data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
      <GearIcon />
    </button>
    <div className="dropdown-menu dropdown-menu-end" aria-labelledby={id} style={{ minWidth: '300px' }}>
      <div className="m-3 d-flex flex-column">
        <label className="ms-2 form-label" htmlFor="gas-limit">Gas limit</label>
        <input
          min="0"
          type="number"
          id="gas-limit"
          value={settings.gasLimit}
          className="form-control field-input"
          onChange={(event) => settings.setGasLimit(event.target.value)}
        />
      </div>
    </div>
  </div>
);

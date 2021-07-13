import React from 'react';
import './Card.css';
import Icon, { BackIcon, GearIcon } from './Icons';

const Card: React.FC = ({ children }): JSX.Element => (
  <div className="card border-rad">
    <div className="card-body">
      {children}
    </div>
  </div>
);

export default Card;

interface CardTitle {
  title: string;
}

export const CardTitle: React.FC<CardTitle> = ({ title }): JSX.Element => (
  <h5 className="h5 my-2 text-center">{title}</h5>
);

interface CardWithBackTitle extends CardTitle {
  onBack: () => void
}

export const CardWithBackTitle: React.FC<CardWithBackTitle> = ({ title, onBack: onBack, children }): JSX.Element => (
  <Card>
    <div className="d-flex justify-content-between">
      <button type="button" className="btn" onClick={onBack}>
        <BackIcon />
      </button>
      <h5 className="my-auto">{title}</h5>
      <div style={{ width: '46px' }} />
    </div>
    {children}
  </Card>
);

interface Settings {
  gasLimit: string;
  setGasLimit: (value: string) => void;
}

interface CardSettingsTitle extends CardWithBackTitle {
  settings: Settings;
}

export const CardSettingsTitle: React.FC<CardSettingsTitle> = ({title, settings, onBack, children}): JSX.Element => {
  return (
    <Card>
      <div className="d-flex justify-content-between">
        <button type="button" className="btn" onClick={onBack}>
          <BackIcon />
        </button>
        <h5 className="my-auto">{title}</h5>
        <div className="btn-group">
          <button className="btn" type="button" id="settings" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
            <GearIcon />
          </button>
          <div className="dropdown-menu dropdown-menu-end" aria-labelledby="settings" style={{ minWidth: "300px" }}>
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
      </div>
      {children}
    </Card>
  );
}
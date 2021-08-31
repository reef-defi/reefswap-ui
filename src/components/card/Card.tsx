import React from 'react';
import { DEFAULT_SLIPPAGE_TOLERANCE, MAX_SLIPPAGE_TOLERANCE, Settings } from '../../store/internalStore';
import './Card.css';
import { BackIcon, GearIcon } from './Icons';
import ReactTooltip from 'react-tooltip';

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

interface CardSettings {
  id?: string;
  settings: Settings;
  setSettings: (value: Settings) => void;
}

export const CardSettings: React.FC<CardSettings> = ({ settings, setSettings, id = 'settings' }) => (
  <div className="btn-group">
    <button className="btn" type="button" id={id} data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
      <GearIcon />
    </button>
    <div className="dropdown-menu dropdown-menu-end border-rad" aria-labelledby={id} style={{ minWidth: '300px' }}>
      <div className="m-3">
        <h5 className="lead-text text-muted">Transaction settings</h5>
        <label className="form-label text-muted sub-text" htmlFor="slipping-tolerance">
          Slippage tolerance
          <b className="ms-1" data-tip data-for="slipping-tolerance-tooltip">?</b>
          <ReactTooltip id="slipping-tolerance-tooltip" place="bottom" effect="solid" backgroundColor="#46288b">
            Your transaction will revert if <br/> the price changes<br/>unfacorably by more than<br/>this percentage.
          </ReactTooltip>
        </label>
        <div className="d-flex flex-row">
          <button
            className={`btn ${settings.percentage === DEFAULT_SLIPPAGE_TOLERANCE ? "btn-reef" : "btn-secondary"} border-rad me-1`}
            onClick={() => setSettings({...settings, percentage: DEFAULT_SLIPPAGE_TOLERANCE})}
          >Auto</button>
          <div className="input-group">
            <input
              min={0}
              max={100}
              step={0.1}
              type="number"
              id="slipping-tolerance"
              value={settings.percentage}
              className="form-control field-input text-end border-rad border-right-0"
              onChange={(event) => setSettings({...settings, percentage: parseFloat(event.target.value)})}
            />
            <span className="input-group-text field-input border-rad ps-1">%</span>
          </div>
        </div>
        <div className="d-flex">
          {settings.percentage < DEFAULT_SLIPPAGE_TOLERANCE && <span className="text-war sub-text mx-auto">Your transaction may fail</span>}
          {settings.percentage > MAX_SLIPPAGE_TOLERANCE && <span className="text-war sub-text mx-auto">Your transaction may be frontrun</span>}
        </div>
        <label className="form-label text-muted sub-text mt-2" htmlFor="deadline">
          Deadline
          <b className="ms-1" data-tip data-for="deadline-tooltip">?</b>
          <ReactTooltip id="deadline-tooltip" place="bottom" effect="solid" backgroundColor="#46288b">
            Your transaction will revert if<br/>it is pending for more than<br/>this period or time.
          </ReactTooltip>
        </label>
        <div className="d-flex flex-row">
          <input
            min={1}
            max={30}
            step={1}
            type="number"
            id="deadline"
            value={settings.deadline}
            className="form-control field-input border-rad w-50 text-end"
            onChange={(event) => setSettings({...settings, deadline: parseInt(event.target.value)})}
          />
          <span className="my-auto ms-1 text-muted sub-text">Minutes</span>
        </div>
      </div>
    </div>
  </div>
);

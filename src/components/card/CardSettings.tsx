import React from 'react';
import ReactTooltip from 'react-tooltip';
import {
  DEFAULT_DEADLINE, DEFAULT_SLIPPAGE_TOLERANCE, MAX_SLIPPAGE_TOLERANCE, Settings,
} from '../../store/internalStore';
import { GearIcon } from './Icons';

interface CardSettings {
  id?: string;
  settings: Settings;
  defaultSlippageTolerance?: number;
  setSettings: (value: Settings) => void;
}

export const CardSettings: React.FC<CardSettings> = ({
  settings, setSettings, id = 'settings', defaultSlippageTolerance = DEFAULT_SLIPPAGE_TOLERANCE,
}) => (
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
            Your transaction will revert if
            {' '}
            <br />
            {' '}
            the price changes
            <br />
            unfacorably by more than
            <br />
            this percentage.
          </ReactTooltip>
        </label>
        <div className="d-flex flex-row">
          <button
            type="button"
            className={`btn ${Number.isNaN(settings.percentage) ? 'btn-reef' : 'btn-secondary'} border-rad me-1`}
            onClick={() => setSettings({ ...settings, percentage: NaN })}
          >
            Auto
          </button>
          <div className="input-group">
            <input
              min={0}
              max={100}
              step={0.1}
              type="number"
              id="slipping-tolerance"
              value={Number.isNaN(settings.percentage) ? '' : settings.percentage}
              placeholder={`${defaultSlippageTolerance}`}
              className="form-control field-input text-end border-rad border-right-0"
              onChange={(event) => setSettings({
                ...settings,
                percentage: event.target.value
                  ? parseFloat(event.target.value)
                  : Number.NaN,
              })}
            />
            <span className="input-group-text field-input border-rad ps-1">%</span>
          </div>
        </div>
        <div className="d-flex pt-2">
          {settings.percentage < defaultSlippageTolerance && <span className="text-war sub-text mx-auto">Your transaction may fail</span>}
          {settings.percentage > defaultSlippageTolerance + MAX_SLIPPAGE_TOLERANCE && <span className="text-war sub-text mx-auto">Your transaction may be frontrun</span>}
        </div>
        <label className="form-label text-muted sub-text mt-2" htmlFor="deadline">
          Deadline
          <b className="ms-1" data-tip data-for="deadline-tooltip">?</b>
          <ReactTooltip id="deadline-tooltip" place="bottom" effect="solid" backgroundColor="#46288b">
            Your transaction will revert if
            <br />
            it is pending for more than
            <br />
            this period or time.
          </ReactTooltip>
        </label>
        <div className="d-flex flex-row">
          <input
            min={1}
            max={30}
            step={1}
            type="number"
            id="deadline"
            placeholder={`${DEFAULT_DEADLINE}`}
            value={Number.isNaN(settings.deadline) ? '' : settings.deadline}
            className="form-control field-input border-rad w-25 text-end"
            onChange={(event) => setSettings({
              ...settings,
              deadline: event.target.value
                ? parseInt(event.target.value, 10)
                : Number.NaN,
            })}
          />
          <span className="my-auto ms-2 text-muted sub-text">minutes</span>
        </div>
      </div>
    </div>
  </div>
);

export default CardSettings;

import React from 'react';
import './Card.css';
import { BackIcon } from './Icons';

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

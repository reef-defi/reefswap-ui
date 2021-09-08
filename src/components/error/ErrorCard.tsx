import React from 'react';
import Card from '../card/Card';

interface ErrorCardProps {
  title: string;
  message: string;
}

const ErrorCard = ({ title, message } : ErrorCardProps): JSX.Element => (
  <Card>
    <h5 className="card-title">{title}</h5>
    <p className="card-text text-danger" dangerouslySetInnerHTML={{ __html: message }} />
  </Card>
);

export default ErrorCard;

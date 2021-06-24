import React from "react"
import "./Card.css";

const Card: React.FC<{}> = ({children}) => (
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

export const CardTitle: React.FC<CardTitle> = ({title}) => (
  <h5 className="h5 my-2 text-center">{title}</h5>
);

interface CardWithBackTitle extends CardTitle {
  onClick: () => void
}

export const CardWithBackTitle: React.FC<CardWithBackTitle> = ({title, onClick, children}) => (
  <Card>
    <div className="d-flex justify-content-between">
      <button className="btn" onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
      </svg>
      </button>
      <h5 className="my-auto">{title}</h5>
      <div style={{width: "46px"}} />
    </div>
    {children}
  </Card>
);


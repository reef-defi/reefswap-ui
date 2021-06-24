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
import React from "react"
import Card from "../../components/card/Card";

interface PoolContollerProps {

}

const PoolContoller = ({} : PoolContollerProps) => {
  return (
    <div>

      <div>
        <span>Your liquidity</span>
        <div>
          <button className="btn btn-reef">Import pool</button>
          <button className="btn btn-reef">Add liquidity</button>
        </div>
      </div>

      <Card>
        <ul>
          <li>
            
          </li>
        </ul>
      </Card>
    </div>
  );
}

export default PoolContoller;
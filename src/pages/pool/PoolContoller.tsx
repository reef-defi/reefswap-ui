import React from "react"
import { useHistory } from "react-router-dom";
import Card from "../../components/card/Card";
import { ADD_LIQUIDITY_URL, IMPORT_POOL_URL } from "../../urls";

interface PoolContollerProps {

}

const PoolContoller = ({} : PoolContollerProps) => {
  const history = useHistory();

  const onImportPoolClick = () => history.push(IMPORT_POOL_URL);
  const onAddLiquidityClick = () => history.push(ADD_LIQUIDITY_URL);

  return (
    <div>

      <div className="d-flex flex-row justify-content-between mx-2 mb-2">
        <h5 className="my-auto">Your liquidity</h5>
        <div>
          <button className="btn btn-reef border-rad" onClick={onImportPoolClick}>Import pool</button>
          <button className="btn btn-reef border-rad ms-1" onClick={onAddLiquidityClick}>Add liquidity</button>
        </div>
      </div>

      <Card>
        <ul>
        </ul>
      </Card>
    </div>
  );
}

export default PoolContoller;
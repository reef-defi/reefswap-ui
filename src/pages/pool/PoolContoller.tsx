import React from "react"
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getContract, loadToken } from "../../api/api";
import Card from "../../components/card/Card";
import { ReducerState } from "../../store/reducers";
import { ADD_LIQUIDITY_URL, IMPORT_POOL_URL } from "../../utils/urls";

interface PoolContollerProps {

}

const PoolContoller = ({} : PoolContollerProps) => {
  const history = useHistory();
  const {accounts, provider, selectedAccount} = useSelector((state: ReducerState) => state.utils);

  const onImportPoolClick = () => history.push(IMPORT_POOL_URL);
  const onAddLiquidityClick = () => history.push(ADD_LIQUIDITY_URL);

  const click = () => {
    if (selectedAccount === -1) { return; }
    const signer = accounts[selectedAccount];

    Promise.resolve()
      .then(() => loadToken("0x3C4Bf01eb3bd2B88E1aCE7fd76Ccb4F12d2867a8", signer.signer))
      .then((contract) => console.log(contract))
      .catch((error) => console.log(error));
  }

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
        <button className="btn btn-reef border-rad" onClick={click}>Import pool</button>
        <ul>
        </ul>
      </Card>
    </div>
  );
}

export default PoolContoller;
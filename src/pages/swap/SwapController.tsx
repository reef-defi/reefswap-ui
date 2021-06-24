import React, { useContext } from "react"
import Card from "../../components/card/Card";
import TokensManager from "../../components/buttons/SelectToken";
import { AppContext } from "../../context/contexts";
import "./SwapController.css";

interface SwapControllerProps {

}

const SwapController = ({} : SwapControllerProps) => {
  const {accounts, extension, provider} = useContext(AppContext)!;

  return (
    <Card>
      <h5 className="">Swap</h5>
      <div className="swap-field p-3 border-rad">
        <TokensManager />
      </div>
    </Card>
  );
}

export default SwapController;
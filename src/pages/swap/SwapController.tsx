import React, { useContext } from "react"
import { AppContext } from "../../context/AppContext";

interface SwapControllerProps {

}

const SwapController = ({} : SwapControllerProps) => {
  const {accounts, extension, provider} = useContext(AppContext)!;

  return (
    <div className="bg-blue">
      Swap
    </div>
  );
}

export default SwapController;
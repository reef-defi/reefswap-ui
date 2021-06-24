import React from "react"
import { useHistory } from "react-router-dom";
import SelectToken from "../../../components/buttons/SelectToken";
import Card, { CardWithBackTitle } from "../../../components/card/Card";
import { POOL_URL } from "../../../urls";

interface ImportPoolProps {

}

const ImportPool = ({} : ImportPoolProps) => {
  const history = useHistory();
  const back = () => history.push(POOL_URL);
  return (
    <CardWithBackTitle title="Import pool" onClick={back}>
      <div className="alert alert-danger mt-2 border-rad" role="alert">
        <b>Tip: </b>
        Use this tool to find v2 pools that don't automatically appear in the interface.
      </div>

      <div className="d-flex">
        <SelectToken />
        <SelectToken />
      </div>

      <button className="btn btn-reef border-rad w-100">Import</button>
    </CardWithBackTitle>
  );
}

export default ImportPool;
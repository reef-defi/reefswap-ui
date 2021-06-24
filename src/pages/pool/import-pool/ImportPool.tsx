import React from "react"
import { useHistory } from "react-router-dom";
import SelectToken, { SelectTokenContent } from "../../../components/buttons/SelectToken";
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

      <div className="row">
        <div className="col-6">
          <button type="button" className="btn btn-token-select border-1 border-rad w-100 hover-border" data-bs-toggle="modal" data-bs-target="#importtoken1">
            REEF 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down ms-1" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
          <div className="modal fade" id="importtoken1" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
            <SelectTokenContent />
          </div>
        </div>

        <div className="col-6">
          <button type="button" className="btn btn-token-select border-1 border-rad w-100 hover-border" data-bs-toggle="modal" data-bs-target="#importtoken2">
            REEF 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down ms-1" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
          <div className="modal fade" id="importtoken2" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
            <SelectTokenContent />
          </div>
        </div>
      </div>
    <button className="btn btn-reef border-rad w-100 mt-2">Import</button>
    </CardWithBackTitle>
  );
}

export default ImportPool;
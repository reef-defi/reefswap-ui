import React from "react";
import Card, { CardTitle } from "../card/Card";
import "./Buttons.css";

interface SelectTokenButton {
  id: string;
  name: string;
}

const SelectTokenButton = ({id, name}: SelectTokenButton) => (
  <button type="button" className="btn btn-token-select border-1 border-rad hover-border" data-bs-toggle="modal" data-bs-target={`#${id}`}>
    {name} 
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down ms-1" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
    </svg>
  </button>
)

interface SelectTokenContent {

}

export const SelectTokenContent = ({}: SelectTokenContent) => {

  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content border-rad">
        <div className="modal-body">
          <CardTitle title="Select token" />
          <div className="w-75 mx-auto select-token-content overflow-auto mt-3">

            <div className="border border-rad p-1 mx-3 field">
              <div className="d-flex justify-content-between mx-2">
                <h6 className="my-auto">Add token</h6>
                <button className="btn btn-sm btn-reef" disabled>Name missing</button>
              </div>
              <div className="d-flex flex-column">
                <input placeholder="Token name" className="mt-1 form-control field-input" />
                <input placeholder="Token address" className="mt-1 form-control field-input" />
              </div>
            </div>

            <hr className="mx-3" />

            <ul className="list-group list-group-flush mx-3">
              <li className="list-group-item px-2"><h6 className="my-auto">Existing tokens</h6></li>
              <li className="list-group-item list-group-item-action">REEF</li>
              <li className="list-group-item list-group-item-action">RUSD</li>
              <li className="list-group-item list-group-item-action">REEF</li>
              <li className="list-group-item list-group-item-action">RUSD</li>
              <li className="list-group-item list-group-item-action">REEF</li>
              <li className="list-group-item list-group-item-action">RUSD</li>
              <li className="list-group-item list-group-item-action">REEF</li>
              <li className="list-group-item list-group-item-action">RUSD</li>
              <li className="list-group-item list-group-item-action">REEF</li>
              <li className="list-group-item list-group-item-action">RUSD</li>
              <li className="list-group-item list-group-item-action">REEF</li>
              <li className="list-group-item list-group-item-action">RUSD</li>
              <li className="list-group-item list-group-item-action">REEF</li>
              <li className="list-group-item list-group-item-action">RUSD</li>
              <li className="list-group-item list-group-item-action">REEF</li>
              <li className="list-group-item list-group-item-action">RUSD</li>
              <li className="list-group-item list-group-item-action">REEF</li>
              <li className="list-group-item list-group-item-action">RUSD</li>
              <li className="list-group-item list-group-item-action">REEF</li>
              <li className="list-group-item list-group-item-action">RUSD</li>
              <li className="list-group-item list-group-item-action">REEF</li>
              <li className="list-group-item list-group-item-action">RUSD</li>
              <li className="list-group-item list-group-item-action">REEF</li>
              <li className="list-group-item list-group-item-action">RUSD</li>
              <li className="list-group-item list-group-item-action">REEF</li>
              <li className="list-group-item list-group-item-action">RUSD</li>
              <li className="list-group-item list-group-item-action">REEF</li>
              <li className="list-group-item list-group-item-action">RUSD</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SelectTokenProps { 
  id?: string;
}

const SelectToken = ({id="exampleModal"} : SelectTokenProps) => {
  return (
    <>
      <SelectTokenButton name="REEF" id={id} />
      <div className="modal fade" id={id} tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
        <SelectTokenContent />
      </div>
    </>
  );
}

export default SelectToken;
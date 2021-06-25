import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToken, Token } from "../../store/actions/tokens";
import { ReducerState } from "../../store/reducers";
import { trim } from "../../utils";
import Card, { CardTitle } from "../card/Card";
import "./Buttons.css";

interface SelectTokenProps { 
  id?: string;
  fullWidth?: boolean;
  selectedTokenName: string;
  onTokenSelect: (token: Token) => void;
}

const getButtonText = (address: string, name: string): string => {
  if (name.length <= 0) { 
    return "Name is empyt";
  } else if (address.length !== 42) {
    return "Address is incorrect";
  } else {
    return "Add token";
  }
}

const SelectToken = ({id="exampleModal", selectedTokenName, onTokenSelect, fullWidth} : SelectTokenProps) => {
  const dispatch = useDispatch();
  const {tokens} = useSelector((state: ReducerState) => state.tokens);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  
  const isTokenValid = name.length !== 0 && address.length === 42;
  const buttonText = getButtonText(address, name);

  const onTokenAdd = () => {
    setName("");
    setAddress("");
    dispatch(addToken(address, name));
    onTokenSelect({address, name});
  }

  const selectToken = (index: number) => onTokenSelect(tokens[index])
  
  const tokensView = tokens
    .map((token, index) => (
      <li 
        key={index}
        data-bs-dismiss="modal"
        onClick={() => selectToken(index)}
        className="list-group-item list-group-item-action row d-flex"
      >
        <div className="col-3">
          {token.name}
        </div>
        <div className="col-9">
          ({trim(token.address, 20)})
        </div>
      </li>
    ));

  return (
    <>
      <button type="button" className={`btn btn-token-select border-1 border-rad hover-border ${fullWidth ? "w-100" : ""}`} data-bs-toggle="modal" data-bs-target={`#${id}`}>
        {selectedTokenName} 
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down ms-1" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
        </svg>
      </button>
      <div className="modal fade" id={id} tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-rad">
            <div className="modal-body">
              <CardTitle title="Select token" />
              <div className="w-75 mx-auto select-token-content overflow-auto mt-3">

                <div className="border border-rad p-1 mx-3 field">
                  <div className="d-flex justify-content-between mx-2">
                    <h6 className="my-auto">Add token</h6>
                    <button
                      className="btn btn-sm btn-reef"
                      disabled={!isTokenValid}
                      onClick={onTokenAdd}
                      data-bs-dismiss="modal"
                    >
                      {buttonText}
                    </button>
                  </div>
                  <div className="d-flex flex-column">
                    <input
                      placeholder="Token name"
                      className="mt-1 form-control field-input"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                    <input
                      placeholder="Token address"
                      className="mt-1 form-control field-input"
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                    />
                  </div>
                </div>

                <hr className="mx-3" />

                <ul className="list-group list-group-flush mx-3">
                  <li className="list-group-item px-2"><h6 className="my-auto">Existing tokens</h6></li>
                  {tokensView}
                </ul>
              </div>
            </div>
          </div>
        </div><div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-rad">
            <div className="modal-body">
              <CardTitle title="Select token" />
              <div className="w-75 mx-auto select-token-content overflow-auto mt-3">

                <div className="border border-rad p-1 mx-3 field">
                  <div className="d-flex justify-content-between mx-2">
                    <h6 className="my-auto">Add token</h6>
                    <button
                      className="btn btn-sm btn-reef"
                      disabled={!isTokenValid}
                      onClick={onTokenAdd}
                    >
                      {buttonText}
                    </button>
                  </div>
                  <div className="d-flex flex-column">
                    <input
                      placeholder="Token name"
                      className="mt-1 form-control field-input"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                    <input
                      placeholder="Token address"
                      className="mt-1 form-control field-input"
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                    />
                  </div>
                </div>

                <hr className="mx-3" />

                <ul className="list-group list-group-flush mx-3">
                  <li className="list-group-item px-2"><h6 className="my-auto">Existing tokens</h6></li>
                  {tokensView}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SelectToken;
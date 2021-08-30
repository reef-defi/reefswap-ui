import React from "react"
import { utilsSetSelectedAccount } from "../../store/actions/accounts";
import { reloadPool } from "../../store/actions/pools";
import { reloadTokensAction } from "../../store/actions/tokens";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { saveSignerPointer } from "../../store/localStore";
import { trim } from "../../utils/utils";
import AccountInfo from "./AccountInfo";

const AccountModal = (): JSX.Element => {
  const dispatch = useAppDispatch();
  // const settings = useAppSelector((state) => state.settings);
  const {accounts, selectedAccount} = useAppSelector((state) => state.accounts);

  const accName = selectedAccount !== -1 ? accounts[selectedAccount].name : '';

  const selectAccount = (index: number): void => {
    saveSignerPointer(index);
    dispatch(utilsSetSelectedAccount(index));
    dispatch(reloadTokensAction());
    dispatch(reloadPool());
  };
  
  const accountsView = accounts
    .map(({ address, evmAddress, name }, index) => (
      <li key={address} className="list-group-item list-group-item-action">
        <AccountInfo
          name={name}
          address={address}
          evmAddress={evmAddress}
          onClick={() => selectAccount(index)}
        />
      </li>
    ));
    
  return (
    <>
    <button type="button" className="btn btn-secondary no-shadow nav-acc-button border-rad hover-border" data-bs-toggle="modal" data-bs-target="#exampleModalToggle">
      {trim(accName)}
    </button>

    <div className="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalToggleLabel">Account info</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            Content
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" data-bs-target="#exampleModalToggle2" data-bs-toggle="modal" data-bs-dismiss="modal">Open second modal</button>
          </div>
        </div>
      </div>
    </div>
    <div className="modal fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header justify-content-between">
            <button type="button" className="btn-close ms-0 me-auto"  data-bs-target="#exampleModalToggle" data-bs-toggle="modal" data-bs-dismiss="modal" aria-label="Close"></button>
            <h5 className="modal-title" id="exampleModalToggleLabel2">Select account</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <ul className="list-group overflow-scroll" style={{ height: "300px"}}>
              {accountsView}
            </ul>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default AccountModal;
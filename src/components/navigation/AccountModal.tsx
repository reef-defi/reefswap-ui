import Identicon from "@polkadot/react-identicon";
import React, { useState } from "react"
import { utilsSetSelectedAccount } from "../../store/actions/accounts";
import { reloadPool } from "../../store/actions/pools";
import { reloadTokensAction } from "../../store/actions/tokens";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { saveSignerPointer } from "../../store/localStore";
import { trim } from "../../utils/utils";
import { BackIcon, CloseIcon, CopyIcon, ExploreIcon } from "../card/Icons";
import AccountInlineInfo from "./AccountInlineInfo";
import {CopyToClipboard} from "react-copy-to-clipboard";
import ReactTooltip from 'react-tooltip';

const AccountModal = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const {reefscanUrl} = useAppSelector((state) => state.settings);
  const {accounts, selectedAccount} = useAppSelector((state) => state.accounts);

  const [toggle, setToggle] = useState("Copy address");

  const accName = selectedAccount !== -1 ? accounts[selectedAccount].name : '';
  const address = selectedAccount !== -1 ? accounts[selectedAccount].address : '';
  const evmAddress = selectedAccount !== -1 ? accounts[selectedAccount].evmAddress : '';

  const selectAccount = (index: number): void => {
    saveSignerPointer(index);
    dispatch(utilsSetSelectedAccount(index));
    dispatch(reloadTokensAction());
    dispatch(reloadPool());
  };
  
  const accountsView = accounts
    .map(({ address, evmAddress, name }, index) => (
      <li key={address} className="list-group-item list-group-item-action">
        <AccountInlineInfo
          name={name}
          address={address}
          evmAddress={evmAddress}
          onClick={() => selectAccount(index)}
        />
      </li>
    ));
    
  const onCopy = () => {
    setToggle("Address copied!");
    setTimeout(() => setToggle("Copy address"), 2000);
  };


  return (
    <>
    <button type="button" className="btn btn-secondary no-shadow nav-acc-button border-rad hover-border" data-bs-toggle="modal" data-bs-target="#exampleModalToggle">
      {trim(accName)}
    </button>

    <div className="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-rad">
          <div className="modal-header border-0">
            <h5 className="modal-title" id="exampleModalToggleLabel">Account</h5>
            <button type="button" className="btn" data-bs-dismiss="modal">
              <CloseIcon />
            </button>
          </div>
          <div className="modal-body py-1">
            <div className="border border-rad p-2">
              <div className="d-flex justify-content-between">
                <small className="form-text text-muted">Connected with polkadot-extension</small>
                <button className="btn btn-reef border-rad btn-sm" data-bs-target="#exampleModalToggle2" data-bs-toggle="modal" data-bs-dismiss="modal">Switch account</button>
              </div>
              <div className="d-flex flex-row m-2 rounded-circle bg-white">
                
                <div data-tip data-for='address' onClick={onCopy}>
                  <Identicon
                    value={address}
                    size={30}
                    theme="substrate"
                  />
                </div>
                <ReactTooltip id="address" place="top" effect="solid" backgroundColor="#46288b">
                  {toggle}
                </ReactTooltip>
                <span className="lead-text fs-5 ms-1">{trim(evmAddress, 11)}</span>
              </div>
              <div className="mx-2 mt-2">
                <CopyToClipboard text={evmAddress} onCopy={onCopy}>
                  <span className="form-text text-muted" data-tip data-for='evm-address' style={{ cursor: 'pointer' }}>
                    <CopyIcon small />
                    <small className="ms-1">Copy EVM Address</small>
                  </span>
                </CopyToClipboard>
                <ReactTooltip id="evm-address" place="top" effect="solid" backgroundColor="#46288b">
                  {toggle}
                </ReactTooltip>
                <a href={`${reefscanUrl}account/${address}`} target="_blank" className="form-text text-muted ms-3" style={{ textDecoration: "none" }}>
                  <ExploreIcon small />
                  <small className="ms-1">View on Explorer</small>
                </a>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center modal-footer border-0 border-rad mt-2">
            <small className="ms-0 form-text text-muted">Your transactions will appear here...</small>
          </div>
        </div>
      </div>
    </div>
    <div className="modal fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-rad">
          <div className="modal-header justify-content-between border-0">
            <button type="button" className="btn ms-0 me-auto py-0"  data-bs-target="#exampleModalToggle" data-bs-toggle="modal" data-bs-dismiss="modal">
              <BackIcon />
            </button>
            <h5 className="modal-title" id="exampleModalToggleLabel2">Select account</h5>
            <button type="button" className="btn py-0 ms-auto" data-bs-dismiss="modal">
              <CloseIcon />
            </button>
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
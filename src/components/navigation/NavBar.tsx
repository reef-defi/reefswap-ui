import React, { useContext, useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom"
import { Signer } from "@reef-defi/evm-provider";
import { utilsSetSelectedAccount } from "../../store/actions/utils";
import { ReducerState } from "../../store/reducers";
import { BIND_URL, POOL_URL, SWAP_URL } from "../../urls";
import "./NavBar.css";

interface Button {
  to: string;
  name: string;
  selected?: boolean;
}

const Button = ({to, name, selected}: Button): JSX.Element => (
  <Link to={to} className={`border-rad h-100 fs-6 fw-bold px-3 py-2 ${selected ? "nav-selected" : "nav-button"}`}>{name}</Link>
)

const trim = (value: string, size=19): string => value.length < size 
  ? value
  : `${value.slice(0, size-6)}...${value.slice(value.length - 3)}`;

const NavBar = (): JSX.Element => {
  const dispatch = useDispatch();
  const {accounts, selectedAccount, provider} = useSelector((state: ReducerState) => state.utils);
  const {pathname} = useLocation();
  const [balance, setBalance] = useState("0");

  useEffect(() => {
    const loadBalance = async () => {
      if (selectedAccount === -1) { return; }
      try {
        const {address} = accounts[selectedAccount];
        const accountBalance = await provider!.getBalance(address);
        const value = accountBalance.toString();
        setBalance(value.length > 18 ? value.slice(0, value.length - 18) : "0");
      } catch (error) {
        console.log("Get balance error: ", error.message);
      }
    };
    loadBalance();
  }, [selectedAccount, accounts])
  
  const selectAccount = (index: number) => dispatch(utilsSetSelectedAccount(index));

  const accName = selectedAccount !== -1 ? accounts[selectedAccount].name : "";
  const accountsView = accounts
    .map((account, index) => (
      <li key={index}>
        <button className="dropdown-item" onClick={() => selectAccount(index)}>
          { trim(account.name) }
        </button>
      </li>
    ))

  return (
    <nav className="container-fluid m-1 mt-3 row">
      <div className="col-md-4 col-sm-1 p-0"><img src="favicon.ico" alt="Not found!" /></div>
      <div className="col-sm-4 p-0">
        <div className="d-flex justify-content-center">
          <div className="d-flex w-auto nav-selection border-rad">
            <Button to={POOL_URL} name="Pool" selected={pathname.startsWith(POOL_URL)} />
            <Button to={SWAP_URL} name="Swap" selected={pathname.startsWith(SWAP_URL)} />
            <Button to={BIND_URL} name="Bind" selected={pathname.startsWith(BIND_URL)} />
          </div>
        </div>
      </div>
      <div className="col-md-4 col-sm-7 col-xs-7 p-0">
        <div className="d-flex justify-content-md-end justify-content-center">
          <div className="d-flex nav-acc border-rad">
            <div className="my-auto mx-2 fs-6 fw-bold">{balance} REEF</div>
            <div className="dropdown">
              <button className="btn btn-secondary dropdown-toggle no-shadow nav-acc-button border-rad hover-border" type="button" id="dropdownMenuReference" data-bs-toggle="dropdown" aria-expanded="false">
                {trim(accName)}
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuReference">
                {accountsView}
              </ul>
            </div>
          </div>
          <div className="d-flex nav-acc border-rad">
            <div className="dropdown">
              <button className="btn btn-secondary d-flex flex-column no-shadow nav-acc-button border-rad" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                ...
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li><a className="dropdown-item" href="#">Action</a></li>
                <li><a className="dropdown-item" href="#">Another action</a></li>
                <li><a className="dropdown-item" href="#">Something else here</a></li>
                <li><hr className="dropdown-divider"/></li>
                <li><a className="dropdown-item" href="#">Separated link</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
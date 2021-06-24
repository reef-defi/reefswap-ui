import React from "react"
import { Link, useLocation } from "react-router-dom"
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

const NavBar = (): JSX.Element => {
  const {pathname} = useLocation();
  const accName = "Frenki-Account (Extension)";
  const name = accName.length > 13 ? accName.slice(0, 12) + "..." + accName.slice(accName.length-4) : accName;
  
  return (
    <nav className="container-fluid m-1 mt-3 row">
      <div className="col-md-4 col-sm-1 p-0"><img src="favicon.ico" alt="Not found!" /></div>
      <div className="col-sm-4 p-0">
        <div className="d-flex justify-content-center">
          <div className="d-flex w-auto nav-selection border-rad">
            <Button to={POOL_URL} name="Pool" selected={pathname === POOL_URL} />
            <Button to={SWAP_URL} name="Swap" selected={pathname === SWAP_URL} />
            <Button to={BIND_URL} name="Bind" selected={pathname === BIND_URL} />
          </div>
        </div>
      </div>
      <div className="col-md-4 col-sm-7 col-xs-7 p-0">
        <div className="d-flex justify-content-md-end justify-content-center">
          <div className="d-flex nav-acc border-rad">
            <div className="my-auto mx-2 fs-6 fw-bold">1000 REEF</div>
            <div className="btn-group">
              <button type="button" className="btn btn-secondary d-flex flex-column no-shadow nav-acc-button border-rad">
                {name}
              </button>
              <button type="button" className="btn btn-secondary dropdown-toggle dropdown-toggle-split no-shadow nav-acc-button border-rad" id="dropdownMenuReference" data-bs-toggle="dropdown" aria-expanded="false" data-bs-reference="parent">
                <span className="visually-hidden">Toggle Dropdown</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuReference">
                <li><a className="dropdown-item" href="#">Action</a></li>
                <li><a className="dropdown-item" href="#">Another action</a></li>
                <li><a className="dropdown-item" href="#">Something else here</a></li>
                <li><hr className="dropdown-divider"/></li>
                <li><a className="dropdown-item" href="#">Separated link</a></li>
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
import React from "react"
import { Link } from "react-router-dom"
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
  return (
    <nav className="container-fluid d-flex m-1 mt-3 justify-content-between">
      <div><img src="favicon.ico" alt="Not found!" /></div>
      <div className="nav-selection border-rad">
        <div className="d-flex">
          <Button to="" name="Pool" selected/>
          <Button to="" name="Swap"/>
          <Button to="" name="Bind"/>
        </div>
      </div>
      <div className="d-flex nav-acc border-rad">
        <div className="my-auto mx-2 fs-6 fw-bold">1000 REEF</div>
        <div className="btn-group">
          <button type="button" className="btn btn-secondary d-flex flex-column no-shadow nav-acc-button border-rad">
            Frenki-Account (Extension)
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
    </nav>
  );
}

export default NavBar;
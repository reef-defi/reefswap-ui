import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { utilsSetSelectedAccount } from '../../store/actions/accounts';
import { ReducerState } from '../../store/reducers';
import {
  BIND_URL, POOL_URL, SETTINGS_URL, SWAP_URL,
} from '../../utils/urls';
import './NavBar.css';

import logo from '../../assets/logo.png';
import { showBalance } from '../../utils/math';
import { trim } from '../../utils/utils';
import { reloadPool } from '../../store/actions/pools';
import { reloadTokens } from '../../store/actions/tokens';

interface ButtonProps {
  to: string;
  name: string;
  selected: boolean;
}

const Button = ({ to, name, selected = false }: ButtonProps): JSX.Element => (
  <Link to={to} className={`border-rad h-100 fs-6 fw-bold px-3 py-2 ${selected ? 'nav-selected' : 'nav-button'}`}>{name}</Link>
);

const NavBar = (): JSX.Element => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { tokens } = useSelector((state: ReducerState) => state.tokens);
  const { accounts, selectedAccount } = useSelector((state: ReducerState) => state.accounts);

  const selectAccount = (index: number): void => {
    dispatch(utilsSetSelectedAccount(index));
    dispatch(reloadTokens());
    dispatch(reloadPool());
  };
  const balance = tokens.length
    ? showBalance(tokens.find((token) => token.name === 'REEF')!)
    : 0;

  const accName = selectedAccount !== -1 ? accounts[selectedAccount].name : '';
  const accountsView = accounts
    .map((account, index) => (
      <li key={account.address}>
        <button type="button" className="dropdown-item" onClick={() => selectAccount(index)}>
          { trim(account.name) }
        </button>
      </li>
    ));

  return (
    <nav className="container-fluid m-1 mt-3 row">
      <div className="col-md-4 col-sm-1 p-0">
        <Link to={SWAP_URL}>
          <img src={logo} alt="Not found!" />
        </Link>
      </div>
      <div className="col-sm-4 p-0">
        <div className="d-flex justify-content-center">
          <div className="d-flex w-auto nav-selection border-rad">
            <Button to={SWAP_URL} name="Swap" selected={pathname.startsWith(SWAP_URL)} />
            <Button to={POOL_URL} name="Pool" selected={pathname.startsWith(POOL_URL)} />
            <Button to={BIND_URL} name="Bind" selected={pathname.startsWith(BIND_URL)} />
          </div>
        </div>
      </div>
      <div className="col-md-4 col-sm-7 col-xs-7 p-0">
        <div className="d-flex justify-content-md-end justify-content-center">
          <div className="d-flex nav-acc border-rad">
            <div className="my-auto mx-2 fs-6 fw-bold">
              {balance}
              {' '}
              REEF
            </div>
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
                <li><a className="dropdown-item" href="https://docs.reef.finance/docs/prologue/introduction/" target="_blank" rel="noreferrer">Docs</a></li>
                <li><a className="dropdown-item" href="https://app.element.io/#/room/#reef:matrix.org" target="_blank" rel="noreferrer">Matrix chat</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" to={SETTINGS_URL}>Settings</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

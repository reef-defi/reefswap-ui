import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { utilsSetSelectedAccount } from '../../store/actions/accounts';
import {
  BIND_URL, POOL_URL, SETTINGS_URL, SWAP_URL,
} from '../../utils/urls';
import './NavBar.css';

import logo from '../../assets/logo.png';
import { showBalance } from '../../utils/math';
import { trim } from '../../utils/utils';
import { reloadPool } from '../../store/actions/pools';
import { reloadTokensAction } from '../../store/actions/tokens';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import AccountInfo from './AccountInfo';
import { BookIcon, ChatIcon, CodeIcon, GearIcon, InfoIcon } from '../card/Icons';

interface ButtonProps {
  to: string;
  name: string;
  selected: boolean;
}

const Button = ({ to, name, selected = false }: ButtonProps): JSX.Element => (
  <Link to={to} className={`border-rad h-100 fs-6 fw-bold px-3 py-2 ${selected ? 'nav-selected' : 'nav-button'}`}>{name}</Link>
);

const NavBar = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  const { tokens } = useAppSelector((state) => state.tokens);
  const { accounts, selectedAccount } = useAppSelector((state) => state.accounts);

  const selectAccount = (index: number): void => {
    dispatch(utilsSetSelectedAccount(index));
    dispatch(reloadTokensAction());
    dispatch(reloadPool());
  };
  const balance = tokens.length
    ? showBalance(tokens.find((token) => token.name === 'REEF')!, 0)
    : '';

  const accName = selectedAccount !== -1 ? accounts[selectedAccount].name : '';
  const accountsView = accounts
    .map(({address, evmAddress, name}, index) => (
      <li key={address}>
        <AccountInfo
          name={name}
          address={address}
          evmAddress={evmAddress}
          onClick={() => selectAccount(index)}
        />
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
            </div>
            <div className="dropdown">
              <button className="btn btn-secondary dropdown-toggle no-shadow nav-acc-button border-rad hover-border" type="button" id="dropdownMenuReference" data-bs-toggle="dropdown" aria-expanded="false">
                {trim(accName)}
              </button>
              <ul className="dropdown-menu dropdown-menu-end border-rad m-1" aria-labelledby="dropdownMenuReference">
                {accountsView}
              </ul>
            </div>
          </div>
          <div className="d-flex nav-acc border-rad">
            <div className="dropdown">
              <button className="btn btn-secondary d-flex flex-column no-shadow nav-acc-button border-rad" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                ...
              </button>
              <ul className="dropdown-menu dropdown-menu-end border-rad m-1" aria-labelledby="dropdownMenuButton1">
                <li>
                  <a className="dropdown-item" href="https://reef.finance/" target="_blank" rel="noreferrer">
                    <InfoIcon />
                    <span className="ms-3 lead-text">About</span>
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="https://docs.reef.finance/docs/prologue/introduction/" target="_blank" rel="noreferrer">
                    <BookIcon />
                    <span className="ms-3 lead-text">Docs</span>
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="https://github.com/reef-defi" target="_blank" rel="noreferrer">
                    <CodeIcon />
                    <span className="ms-3 lead-text">Code</span>
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="https://app.element.io/#/room/#reef:matrix.org" target="_blank" rel="noreferrer">
                    <ChatIcon />
                    <span className="ms-3 lead-text">Matrix chat</span>
                  </a>
                </li>
                <li>
                  <Link className="dropdown-item" to={SETTINGS_URL}>
                    <GearIcon />
                    <span className="ms-3 lead-text">Settings</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

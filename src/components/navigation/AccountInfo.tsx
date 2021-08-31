import React from 'react';
import Identicon from '@polkadot/react-identicon';
import { trim } from '../../utils/utils';

interface AccountInfo {
  name: string;
  address: string;
  evmAddress: string;
  toggle?: string;
  onClick: () => void;
}

const AccountInfo = ({
  name, address, evmAddress, toggle = 'exampleModalToggle', onClick,
} : AccountInfo): JSX.Element => (
  <div className="d-flex flex-row px-0">
    <div className="my-auto mx-2 rounded-circle bg-white">
      <Identicon
        value={address}
        size={32}
        theme="substrate"
      />
    </div>
    <div className="d-flex flex-column align-start ps-2 pe-4" onClick={onClick} role="button" tabIndex={0} data-bs-target={`#${toggle}`} data-bs-toggle="modal" data-bs-dismiss="modal">
      <span className="lead-text">{trim(name, 30)}</span>
      <span className="sub-text">{trim(evmAddress, 30)}</span>
    </div>
  </div>
);

export default AccountInfo;

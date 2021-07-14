import React from "react"
import Identicon from '@polkadot/react-identicon';
import { trim } from "../../utils/utils";

interface AccountInfo {
  name: string;
  address: string;
  evmAddress: string;
  onClick: () => void;
}

const AccountInfo = ({name, address, evmAddress, onClick} : AccountInfo): JSX.Element => {
  return (
    <div className="dropdown-item d-flex flex-row px-0">
      <div className="my-auto mx-2 rounded-circle bg-white">
        <Identicon 
          value={address}
          size={32}
          theme="substrate"
        />
      </div>
      <div className="d-flex flex-column align-start ps-2 pe-4" onClick={onClick}>
        <span className="lead-text">{trim(name, 25)}</span>
        <span className="sub-text">{trim(evmAddress, 25)}</span>
      </div>
    </div>
  );
}

export default AccountInfo;
import React, { useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { Token, loadToken } from '../../api/rpc/tokens';
import { addTokenAction } from '../../store/actions/tokens';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toBalance } from '../../utils/math';
import { ensure, trim } from '../../utils/utils';
import { DownIcon, TokenIcon } from '../card/Icons';
import { Loading } from '../loading/Loading';
import { IconButton } from './Button';
import './Buttons.css';

interface SelectTokenProps {
  id?: string;
  iconUrl: string;
  fullWidth?: boolean;
  selectedTokenName: string;
  onTokenSelect: (newToken: Token) => void;
}

const doesAddressAlreadyExist = (address: string, tokens: Token[]): boolean => tokens.find((token) => token.address === address) !== undefined;

const SelectToken = ({
  id = 'exampleModal', selectedTokenName, onTokenSelect, fullWidth = false, iconUrl,
} : SelectTokenProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const { tokens } = useAppSelector((state) => state.tokens);
  const { accounts, selectedAccount } = useAppSelector((state) => state.accounts);

  const [isLoading, setIsLoading] = useState(false);
  const [tokenAddressOrName, setTokenAddressOrName] = useState('');

  const isEmpty = selectedTokenName === 'Select token';

  useEffect(() => {
    if (tokenAddressOrName.length !== 42 || selectedAccount === -1) { return; }

    const load = async (): Promise<void> => {
      try {
        const { signer } = accounts[selectedAccount];
        ensure(!doesAddressAlreadyExist(tokenAddressOrName, tokens), 'Token already in list');
        setIsLoading(true);
        const newToken = await loadToken(tokenAddressOrName, signer, '');
        dispatch(addTokenAction(newToken));
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [tokenAddressOrName]);

  const tokensView = tokens
    .filter((token) => token.name.toLowerCase().startsWith(tokenAddressOrName.toLowerCase())
      || token.address.toLowerCase().startsWith(tokenAddressOrName.toLowerCase()))
    .map((token) => (
      <li
        key={token.address}
        data-bs-dismiss="modal"
        onClick={() => onTokenSelect(token)}
        className="list-group-item list-group-item-action d-flex justify-content-between"
        role="presentation"
      >
        <div className="d-flex flex-row">
          <div className="my-auto">
            <TokenIcon src={token.iconUrl} />
          </div>
          <div className="d-flex flex-column ms-3">
            <span className="title-text user-select-none">{token.name}</span>
            <span className="mini-text user-select-none">{trim(token.address, 20)}</span>
          </div>
        </div>
        <span className="my-auto user-select-none">{toBalance(token).toFixed(4)}</span>
      </li>
    ));

  return (
    <>
      <button type="button" className={`btn btn-select border-rad ${fullWidth && 'w-100'} ${isEmpty ? 'btn-reef' : 'btn-token-select'}`} data-bs-toggle="modal" data-bs-target={`#${id}`}>
        {!isEmpty && <TokenIcon src={iconUrl} />}
        <div className={`my-auto ${!isEmpty ? 'mx-2' : 'me-2'}`}>
          {selectedTokenName}
        </div>
        <DownIcon small />
      </button>
      <div className="modal fade" id={id} tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-rad">
            <div className="modal-header border-0">
              <h5 className="title-text" id="exampleModalLabel">Select Token</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body py-0">
              <input
                value={tokenAddressOrName}
                maxLength={42}
                placeholder="Search name or paste address"
                className="form-control form-control-lg border-rad"
                onChange={(event) => setTokenAddressOrName(event.target.value)}
              />
              <label className="mt-3">
                Common bases
                <b className="ms-1" data-tip data-for="common-bases">?</b>
                <ReactTooltip id="common-bases" place="right" effect="solid" backgroundColor="#46288b">
                  These tokens are commonly
                  <br />
                  paired with other tokens.
                </ReactTooltip>
              </label>
              <div className="mt-1">
                {/* THIS IS HACK CAUSE I KNOW THAT THE FIRST TOKEN IN TOKEN LIST IS ALWAYS REEF TOKEN! */}
                <IconButton onClick={() => onTokenSelect(tokens[0])}>
                  <TokenIcon src={tokens[0].iconUrl} />
                  <span className="ms-1">{tokens[0].name}</span>
                </IconButton>
              </div>
            </div>
            <div className="">
              <ul className="list-group list-group-flush list-group-full px-0">
                <li className="list-group-item px-2" />
                {isLoading ? <Loading /> : tokensView}
                <li className="list-group-item px-2" />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectToken;

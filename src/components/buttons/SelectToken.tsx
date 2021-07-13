import React, { ChangeEvent, useState } from 'react';
import { loadToken, getContract } from '../../api/api';
import { addTokenAction } from '../../store/actions/tokens';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { ensure, trim } from '../../utils/utils';
import { CardTitle } from '../card/Card';
import { LoadingButtonIcon } from '../loading/Loading';
import './Buttons.css';

interface SelectTokenProps {
  id?: string;
  fullWidth?: boolean;
  selectedTokenName: string;
  onTokenSelect: (index: number) => void;
}

const TO_SHORT_ADDRESS = 'To short address';
const UNKNOWN_ADDRESS = 'Unknow address';
const SELECT_ACCOUNT = 'Select account';

const SelectToken = ({
  id = 'exampleModal', selectedTokenName, onTokenSelect, fullWidth,
} : SelectTokenProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const { tokens } = useAppSelector((state) => state.tokens);
  const { accounts, selectedAccount } = useAppSelector((state) => state.accounts);

  const [address, setAddress] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonText, setButtonText] = useState(TO_SHORT_ADDRESS);

  const onTokenAdd = async (): Promise<void> => {
    try {
      setIsLoading(true);
      ensure(isValid, UNKNOWN_ADDRESS);
      ensure(selectedAccount !== -1, SELECT_ACCOUNT);
      const { signer } = accounts[selectedAccount];
      const token = await loadToken(address, signer);
      dispatch(addTokenAction(token));
    } catch (error) {
      setButtonText(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onAddressChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const newAddress = event.target.value;
    setAddress(newAddress);
    setIsValid(false);
    setButtonText(TO_SHORT_ADDRESS);

    if (newAddress.length === 42) {
      try {
        setIsLoading(true);
        ensure(selectedAccount !== -1, SELECT_ACCOUNT);
        const { signer } = accounts[selectedAccount];
        const contract = await getContract(newAddress, signer);
        const symbol = await contract.symbol();
        setIsValid(true);
        setButtonText(`Add ${symbol}`);
      } catch (error) {
        setButtonText(error.message);
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const selectToken = (index: number): void => onTokenSelect(index);

  const tokensView = tokens
    .map((token, index) => (
      <li
        key={token.address}
        data-bs-dismiss="modal"
        onClick={() => selectToken(index)}
        className="list-group-item list-group-item-action row d-flex"
        role="presentation"
      >
        <div className="col-3">
          {token.name}
        </div>
        <div className="col-9">
          (
          {trim(token.address, 20)}
          )
        </div>
      </li>
    ));

  return (
    <>
      <button type="button" className={`btn btn-token-select border-1 border-rad hover-border ${fullWidth ? 'w-100' : ''}`} data-bs-toggle="modal" data-bs-target={`#${id}`}>
        {selectedTokenName}
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down ms-1" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
        </svg>
      </button>
      <div className="modal fade" id={id} tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-rad">
            <div className="modal-body">
              <CardTitle title="Select token" />
              <div className="w-75 mx-auto select-token-content overflow-auto mt-3">

                <div className="border border-rad p-1 mx-3 field">
                  <div className="d-flex justify-content-between mx-2">
                    <h6 className="my-auto">Add token</h6>
                    <button
                      type="button"
                      className="btn btn-sm btn-reef"
                      disabled={!isValid || isLoading}
                      onClick={onTokenAdd}
                      data-bs-dismiss="modal"
                    >
                      {isLoading ? <LoadingButtonIcon /> : buttonText}
                    </button>
                  </div>
                  <div className="d-flex flex-column">
                    <input
                      placeholder="Token address"
                      className="form-control field-input"
                      value={address}
                      maxLength={42}
                      onChange={onAddressChange}
                    />
                  </div>
                </div>

                <hr className="mx-3" />

                <ul className="list-group list-group-flush mx-3">
                  <li className="list-group-item px-2"><h6 className="my-auto">Existing tokens</h6></li>
                  {tokensView}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

SelectToken.defaultProps = {
  id: 'exampleModal',
  fullWidth: false,
};

export default SelectToken;

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Card, { CardTitle } from '../../components/card/Card';
import { LoadingButtonIcon } from '../../components/loading/Loading';
import { bindSigner } from '../../api/accounts';
import { utilsSetSelectedAccount } from '../../store/actions/accounts';
import { ensure } from '../../utils/utils';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { errorToast } from '../../utils/errorHandler';

const BindController = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { accounts, selectedAccount } = useAppSelector((state) => state.accounts);
  const { signer, isEvmClaimed } = accounts[selectedAccount];

  const [isLoading, setIsLoading] = useState(false);

  const onBind = async (): Promise<void> => {
    try {
      ensure(!isEvmClaimed, 'Account is already binded!');
      setIsLoading(true);
      await bindSigner(signer);
      // Forcing token balance update
      dispatch(utilsSetSelectedAccount(0));
      dispatch(utilsSetSelectedAccount(selectedAccount));
      toast.success('Account binded successfully');
    } catch (error) {
      errorToast(error.message)
    } finally {
      setIsLoading(false);
    }
  };

  const buttonText = isEvmClaimed
    ? 'Selected account is binded'
    : 'Bind';

  return (
    <Card>
      <CardTitle title="Bind selected account" />
      <div className="alert alert-danger mt-2 border-rad" role="alert">
        <b>Tip: </b>
        Bind an EVM account to your Substrate account, so that you can use a single account for any transactions on the Reef
        chain.
        {' '}
        <a target="_blank" href="https://docs.reef.finance/docs/developers/accounts/#linking-an-existing-ethereum-address" rel="noreferrer">Read more.</a>
      </div>

      <button
        type="button"
        className="btn btn-reef w-100 border-rad mt-2"
        onClick={onBind}
        disabled={isEvmClaimed || isLoading}
      >
        { isLoading ? <LoadingButtonIcon /> : buttonText }
      </button>
    </Card>
  );
};

export default BindController;

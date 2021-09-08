import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Card, { CardTitle } from '../../components/card/Card';
import { LoadingButtonIcon } from '../../components/loading/Loading';
import { ensure } from '../../utils/utils';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { errorToast } from '../../utils/errorHandler';
import { bindSigner } from '../../api/rpc/accounts';
import { accountsSetAccount } from '../../store/actions/accounts';
import { loadTokens } from '../../api/rpc/tokens';
import { setAllTokensAction } from '../../store/actions/tokens';

const BindController = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { tokens } = useAppSelector((state) => state.tokens);
  const { accounts, selectedAccount } = useAppSelector((state) => state.accounts);
  const signer = accounts[selectedAccount];

  const [isLoading, setIsLoading] = useState(false);

  const onBind = async (): Promise<void> => {
    try {
      ensure(!signer.isEvmClaimed, 'Account is already binded!');
      setIsLoading(true);
      await bindSigner(signer.signer);
      const newTokens = await loadTokens(tokens, signer.signer);
      dispatch(setAllTokensAction(newTokens));
      dispatch(accountsSetAccount({ ...signer, isEvmClaimed: true }));
      toast.success('Account binded successfully! Reloading application');
    } catch (error) {
      errorToast(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonText = signer.isEvmClaimed
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
        className="btn btn-reef btn-lg w-100 border-rad mt-2"
        onClick={onBind}
        disabled={signer.isEvmClaimed || isLoading}
      >
        { isLoading ? <LoadingButtonIcon /> : buttonText }
      </button>
    </Card>
  );
};

export default BindController;

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import Card, { CardTitle } from '../../components/card/Card';
import { ReducerState } from '../../store/reducers';
import { LoadingButtonIcon } from '../../components/loading/Loading';
import { bindSigner } from '../../api/accounts';
import { utilsSetSelectedAccount } from '../../store/actions/utils';

const BindController = (): JSX.Element => {
  const dispatch = useDispatch();
  const { accounts, selectedAccount } = useSelector((state: ReducerState) => state.utils);

  const [isClaimed, setIsClaimed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const { signer } = accounts[selectedAccount];
        setIsClaimed(await signer.isClaimed());
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const onBind = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const { signer } = accounts[selectedAccount];
      await bindSigner(signer);
      // Forcing token balance update
      dispatch(utilsSetSelectedAccount(0));
      dispatch(utilsSetSelectedAccount(selectedAccount));
      toast.success('Account binded successfully');
    } catch (error) {
      toast.error(error);
      setIsLoading(false);
    }
  };

  const buttonText = isClaimed
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
        disabled={isClaimed || isLoading}
      >
        { isLoading ? <LoadingButtonIcon /> : buttonText }
      </button>
    </Card>
  );
};

export default BindController;

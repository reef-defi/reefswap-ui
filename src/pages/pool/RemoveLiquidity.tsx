import { Components } from '@reef-defi/react-lib';
import React from 'react';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { useTokensFinder } from '../../hooks/useTokensFinder';
import { useAppSelector } from '../../store/hooks';
import { notify } from '../../utils/notify';
import { POOLS_URL } from '../../utils/urls';

interface UrlParams {
  address1: string;
  address2: string;
}

const RemoveLiquidity = (): JSX.Element => {
  const history = useHistory();
  const { address1, address2 } = useParams<UrlParams>();
  const network = useAppSelector((state) => state.settings);
  const { accounts, selectedAccount } = useAppSelector((state) => state.accounts);
  const {tokens} = useAppSelector((state) => state.tokens);
  const signer = accounts[selectedAccount];

  const [token1, token2, state] = useTokensFinder({
    address1,
    address2,
    tokens,
    signer,
  });
  const back = (): void => history.goBack();

  // Redirecting to pools page if any of tokens is empty on success
  if (state === 'Success' && (token1.isEmpty || token2.isEmpty)) {
    return <Redirect to={POOLS_URL} />;
  }


  if (state !== 'Success' || !network) {
    return <div />;
  }

  return (
    <Components.RemoveLiquidityComponent
      token1={token1}
      token2={token2}
      signer={signer}
      network={network}
      options={{ back, notify }}
    />
  );
};

export default RemoveLiquidity;

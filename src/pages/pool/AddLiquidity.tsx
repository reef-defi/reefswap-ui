import React from 'react';
import { notify } from "./../../utils/notify";
import { useHistory, useParams } from 'react-router-dom';
import { addressReplacer, ADD_LIQUIDITY_URL } from '../../utils/urls';
import { useAppSelector } from '../../store/hooks';
import { Components, TokenSelector } from '@reef-defi/react-lib';
import { useTokensFinder } from "./../../hooks/useTokensFinder";

interface UrlParams {
  address1: string;
  address2: string;
}

const AddLiquidity = (): JSX.Element => {
  const history = useHistory();
  const { address1, address2 } = useParams<UrlParams>();
  const network = useAppSelector((state) => state.settings);
  const { tokens } = useAppSelector((state) => state.tokens);
  const { accounts, selectedAccount } = useAppSelector((state) => state.accounts);
  const signer = accounts[selectedAccount];

  const [token1, token2, state] = useTokensFinder({
    address1,
    address2,
    signer,
    tokens,
  });

  const onTokenSelect = (address: string, token: TokenSelector = 'token1'): void => history.push(
    token === 'token1'
      ? addressReplacer(ADD_LIQUIDITY_URL, address, address2)
      : addressReplacer(ADD_LIQUIDITY_URL, address1, address),
  );

  if (state !== "Success") {
    return (<div />);
  }
  
  return (
    <Components.AddLiquidity
      tokens={tokens}
      signer={signer}
      network={network}
      tokenValue1={token1}
      tokenValue2={token2}
      options={{
        notify,
        onTokenSelect,
        back: history.goBack,
      }}
    />
  )
};

export default AddLiquidity;

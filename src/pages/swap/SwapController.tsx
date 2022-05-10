import React from 'react';
import { toast } from 'react-toastify';
import { Components, TokenSelector} from "@reef-defi/react-lib";
import { useHistory, useParams } from 'react-router-dom';
import { addressReplacer, SWAP_URL, UrlAddressParams } from '../../utils/urls';
import { useTokensFinder } from "./../../hooks/useTokensFinder";
import { useAppSelector } from '../../store/hooks';
import { notify } from '../../utils/notify';

const {SwapComponent} = Components;

const SwapController = (): JSX.Element => {
  const history = useHistory();
  const { tokens } = useAppSelector((state) => state.tokens);
  const network = useAppSelector((state) => state.settings);
  const { accounts, selectedAccount } = useAppSelector((state) => state.accounts);
  const signer = accounts[selectedAccount];

  const onTokenSelect = (address: string, token: TokenSelector = 'token1'): void => history.push(
    token === 'token1'
      ? addressReplacer(SWAP_URL, address, address2)
      : addressReplacer(SWAP_URL, address1, address),
  );

  const {address1, address2} = useParams<UrlAddressParams>();
  const [token1, token2, state] = useTokensFinder({
    address1,
    address2,
    tokens,
    signer
  });

  if (state !== 'Success') {
    return <div />
  }

  return (
    <SwapComponent 
      buyToken={token2}
      sellToken={token1}
      tokens={tokens}
      account={signer}
      network={network}
      options={{
        notify,
        onTokenSelect,
      }}    
    />
  )
};

export default SwapController;

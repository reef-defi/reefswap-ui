import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  reloadTokens, swapTokens, Token, TokenWithAmount,
} from '../../api/tokens';
import { ButtonStatus } from '../../components/buttons/Button';
import Card, { CardTitle } from '../../components/card/Card';
import TokenAmountField from '../../components/card/TokenAmountField';
import { LoadingButtonIcon } from '../../components/loading/Loading';
import { setAllTokensAction } from '../../store/actions/tokens';
import { ReducerState } from '../../store/reducers';

const swapStatus = (sellAmount: string, buyAmount: string): ButtonStatus => {
  if (sellAmount.length === 0) {
    return { isValid: false, text: 'Missing sell amount' };
  } if (buyAmount.length === 0) {
    return { isValid: false, text: 'Missing buy amount' };
  }
  return { isValid: true, text: 'Swap' };
};

const SwapController = (): JSX.Element => {
  const dispatch = useDispatch();
  const { tokens } = useSelector((state: ReducerState) => state.tokens);
  const { accounts, selectedAccount } = useSelector((state: ReducerState) => state.accounts);
  const { signer } = accounts[selectedAccount];

  const [isLoading, setIsLoading] = useState(false);
  const [buyToken, setBuyToken] = useState<TokenWithAmount>({ ...tokens[1], amount: '' });
  const [sellToken, setSellToken] = useState<TokenWithAmount>({ ...tokens[0], amount: '' });

  const { text, isValid } = swapStatus(sellToken.amount, buyToken.amount);

  const setBuyAmount = (amount: string): void => setBuyToken({ ...buyToken, amount });
  const setSellAmount = (amount: string): void => setSellToken({ ...sellToken, amount });

  const changeBuyToken = (token: Token): void => setBuyToken({ ...token, amount: '' });
  const changeSellToken = (token: Token): void => setSellToken({ ...token, amount: '' });

  const onSwitch = (): void => {
    const subToken = { ...sellToken };
    setSellToken({ ...buyToken });
    setBuyToken({ ...subToken });
  };

  const onSwap = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await swapTokens(sellToken, buyToken, signer);
      toast.success('Swap complete!');
    } catch (error) {
      toast.error(error.message ? error.message : error);
    } finally {
      const newTokens = await reloadTokens(tokens, signer);
      dispatch(setAllTokensAction(newTokens));
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardTitle title="Swap" />
      <TokenAmountField
        id="sell-token-field"
        token={sellToken}
        onAmountChange={setSellAmount}
        onTokenSelect={changeSellToken}
      />
      <div className="d-flex justify-content-center">
        <div className="btn-content-field border-rad">
          <button type="button" className="btn btn-field border-rad hover-border" onClick={onSwitch}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-down-short" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z" />
            </svg>
          </button>
        </div>
      </div>
      <TokenAmountField
        id="buy-token-field"
        token={buyToken}
        onAmountChange={setBuyAmount}
        onTokenSelect={changeBuyToken}
      />
      <div className="d-flex justify-content-center mt-2">
        <button
          type="button"
          className="btn btn-reef border-rad w-100"
          onClick={onSwap}
          disabled={!isValid || isLoading}
        >
          {isLoading ? <LoadingButtonIcon /> : text}
        </button>
      </div>
    </Card>
  );
};

export default SwapController;

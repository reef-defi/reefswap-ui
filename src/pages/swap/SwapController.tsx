import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  reloadTokens, swapTokens, toTokenAmount,
} from '../../api/tokens';
import { ButtonStatus } from '../../components/buttons/Button';
import Card, { CardHeader, CardHeaderBlank, CardSettings, CardTitle } from '../../components/card/Card';
import { DownArrowIcon } from '../../components/card/Icons';
import TokenAmountField from '../../components/card/TokenAmountField';
import { LoadingButtonIcon } from '../../components/loading/Loading';
import { setAllTokensAction } from '../../store/actions/tokens';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { defaultGasLimit, defaultTokenState } from '../../store/internalStore';

const swapStatus = (sellAmount: string, buyAmount: string, isEvmClaimed: boolean): ButtonStatus => {
  if (!isEvmClaimed) {
    return { isValid: false, text: "Bind account"};
  } else if (sellAmount.length === 0) {
    return { isValid: false, text: 'Missing sell amount' };
  } else if (buyAmount.length === 0) {
    return { isValid: false, text: 'Missing buy amount' };
  } else {
    return { isValid: true, text: 'Swap' };
  }
};


const SwapController = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { tokens } = useAppSelector((state) => state.tokens);
  const { accounts, selectedAccount } = useAppSelector((state) => state.accounts);
  const { signer, isEvmClaimed } = accounts[selectedAccount];

  const [buy, setBuy] = useState(defaultTokenState(1));
  const [sell, setSell] = useState(defaultTokenState());
  const [gasLimit, setGasLimit] = useState(defaultGasLimit()) 
  const [isLoading, setIsLoading] = useState(false);

  const buyToken = toTokenAmount(tokens[buy.index], buy.amount);
  const sellToken = toTokenAmount(tokens[sell.index], sell.amount);
  const { text, isValid } = swapStatus(sell.amount, buy.amount, isEvmClaimed);

  const setBuyAmount = (amount: string): void => setBuy({ ...buy, amount });
  const setSellAmount = (amount: string): void => setSell({ ...sell, amount })

  const changeBuyToken = (index: number): void => setBuy({...buy, index});
  const changeSellToken = (index: number): void => setSell({...sell, index});

  const onSwitch = (): void => {
    const subState = {...buy};
    setBuy({...sell});
    setSell({...subState});
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
      <CardHeader>
        <CardHeaderBlank />
        <CardTitle title="Swap" />
        <CardSettings settings={{ gasLimit, setGasLimit }} />
      </CardHeader>
      
      <TokenAmountField
        id="sell-token-field"
        token={sellToken}
        onAmountChange={setSellAmount}
        onTokenSelect={changeSellToken}
      />
      <div className="d-flex justify-content-center">
        <div className="btn-content-field border-rad">
          <button type="button" className="btn btn-field border-rad hover-border" onClick={onSwitch}>
            <DownArrowIcon />
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

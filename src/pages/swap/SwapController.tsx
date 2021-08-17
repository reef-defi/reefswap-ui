import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { swapTokens, loadTokens } from '../../api/rpc/tokens';
import { ButtonStatus } from '../../components/buttons/Button';
import Card, {
  CardHeader, CardHeaderBlank, CardSettings, CardTitle,
} from '../../components/card/Card';
import { DownArrowIcon } from '../../components/card/Icons';
import TokenAmountField from '../../components/card/TokenAmountField';
import { LoadingButtonIcon } from '../../components/loading/Loading';
import { priceHook } from '../../hooks/priceHook';
import { setAllTokensAction } from '../../store/actions/tokens';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { defaultGasLimit } from '../../store/internalStore';
import { errorToast } from '../../utils/errorHandler';
import { calculateCurrencyAmount } from '../../utils/math';

const swapStatus = (sellAmount: string, buyAmount: string, isEvmClaimed: boolean): ButtonStatus => {
  if (!isEvmClaimed) {
    return { isValid: false, text: 'Bind account' };
  } if (sellAmount.length === 0) {
    return { isValid: false, text: 'Missing sell amount' };
  } if (buyAmount.length === 0) {
    return { isValid: false, text: 'Missing buy amount' };
  }
  return { isValid: true, text: 'Swap' };
};

const SwapController = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { tokens } = useAppSelector((state) => state.tokens);
  const { accounts, selectedAccount } = useAppSelector((state) => state.accounts);
  const { signer, isEvmClaimed } = accounts[selectedAccount];

  const [buyIndex, setBuyIndex] = useState(1);
  const [sellIndex, setSellIndex] = useState(0);
  const [buy, isBuyLoading, setBuy] = priceHook(buyIndex);
  const [sell, isSellLoading, setSell] = priceHook(sellIndex);
  const [gasLimit, setGasLimit] = useState(defaultGasLimit());
  const [isSwapLoading, setIsSwapLoading] = useState(false);

  const { text, isValid } = swapStatus(sell.amount, buy.amount, isEvmClaimed);
  const isLoading = isSwapLoading || isBuyLoading || isSellLoading;

  const setBuyAmount = (amount: string): void => {
    setBuy({ ...buy, amount });
    setSell({...sell, amount: amount
      ? calculateCurrencyAmount(amount, buy.price, sell.price)
      : amount
    });
  };
  const setSellAmount = (amount: string): void => {
    setSell({ ...sell, amount });
    setBuy({...buy, amount: amount 
      ? calculateCurrencyAmount(amount, sell.price, buy.price) 
      : amount
    });
  }

  const changeBuyToken = (index: number): void => {
    setSell({ ...sell, amount: ""});
    setBuy({ ...buy, amount: ""});
    setBuyIndex(index);
  }
  const changeSellToken = (index: number): void => {
    setBuy({...buy, amount: ""});
    setSell({ ...sell, amount: "" });
    setSellIndex(index);
  };

  const onSwitch = (): void => {
    const subBuyState = { ...buy };
    const subSellState = { ...sell };
    const bi = buyIndex;
    setBuyIndex(sellIndex);
    setSellIndex(bi);
    setBuy({...subSellState});
    setSell({ ...subBuyState });
  };

  const onSwap = async (): Promise<void> => {
    try {
      setIsSwapLoading(true);
      await swapTokens(sell, buy, signer, gasLimit);
      toast.success('Swap complete!');
    } catch (error) {
      errorToast(error.message);
    } finally {
      const newTokens = await loadTokens(tokens, signer);
      dispatch(setAllTokensAction(newTokens));
      setIsSwapLoading(false);
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
        token={sell}
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
        token={buy}
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

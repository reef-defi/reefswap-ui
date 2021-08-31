import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getReefswapRouter } from '../../api/rpc/rpc';
import {
  loadTokens, TokenWithAmount, createEmptyTokenWithAmount, toTokenAmount, Token, approveTokenAmount,
} from '../../api/rpc/tokens';
import { ButtonStatus } from '../../components/buttons/Button';
import Card, {
  CardHeader, CardHeaderBlank, CardTitle,
} from '../../components/card/Card';
import CardSettings from '../../components/card/CardSettings';
import { DownArrowIcon } from '../../components/card/Icons';
import TokenAmountField from '../../components/card/TokenAmountField';
import { LoadingButtonIconWithText } from '../../components/loading/Loading';
import { PoolHook } from '../../hooks/poolHook';
import { setAllTokensAction } from '../../store/actions/tokens';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { defaultSettings, resolveSettings } from '../../store/internalStore';
import { errorToast } from '../../utils/errorHandler';
import { calculateAmount, calculateAmountWithPercentage, calculateDeadline } from '../../utils/math';

const swapStatus = (sell: TokenWithAmount, buy: TokenWithAmount, isEvmClaimed: boolean, poolError?: string): ButtonStatus => {
  if (!isEvmClaimed) {
    return { isValid: false, text: 'Bind account' };
  } if (sell.isEmpty) {
    return { isValid: false, text: 'Select sell token' };
  } if (buy.isEmpty) {
    return { isValid: false, text: 'Select buy token' };
  } if (poolError) {
    return { isValid: false, text: poolError };
  } if (sell.amount.length === 0) {
    return { isValid: false, text: 'Missing sell amount' };
  } if (buy.amount.length === 0) {
    return { isValid: false, text: 'Missing buy amount' };
  }
  return { isValid: true, text: 'Swap' };
};

const SwapController = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const networkSettings = useAppSelector((state) => state.settings);
  const { tokens } = useAppSelector((state) => state.tokens);
  const { accounts, selectedAccount } = useAppSelector((state) => state.accounts);
  const { signer, evmAddress, isEvmClaimed } = accounts[selectedAccount];

  const [buy, setBuy] = useState(createEmptyTokenWithAmount());
  const [sell, setSell] = useState(toTokenAmount(tokens[0], { amount: '', price: 0, index: 0 }));

  const [status, setStatus] = useState("");
  const [settings, setSettings] = useState(defaultSettings());
  const [isSwapLoading, setIsSwapLoading] = useState(false);

  
  const {percentage, deadline} = resolveSettings(settings);

  const { poolError, isPoolLoading } = PoolHook({
    token1: sell,
    token2: buy,
    signer,
    settings: networkSettings,
    setToken1: setSell,
    setToken2: setBuy,
  });

  const { text, isValid } = swapStatus(sell, buy, isEvmClaimed, poolError);
  const isLoading = isSwapLoading || isPoolLoading;

  // Updating user token balance.. its a bit hecky
  useEffect(() => {
    tokens
      .forEach((token) => {
        if (token.address === buy.address) {
          setBuy({ ...buy, ...token });
        }
        if (token.address === sell.address) {
          setSell({ ...sell, ...token });
        }
      });
  }, [tokens]);

  // TODO both functions are alike, create a wrapper!
  const setBuyAmount = (amount: string): void => {
    if (amount === '') {
      setSell({ ...sell, amount });
      setBuy({ ...buy, amount });
    } else {
      const amo = parseFloat(amount) * buy.price / sell.price;
      setBuy({ ...buy, amount });
      setSell({ ...sell, amount: `${amo.toFixed(4)}` });
    }
  };
  const setSellAmount = (amount: string): void => {
    if (amount === '') {
      setSell({ ...sell, amount });
      setBuy({ ...buy, amount });
    } else {
      const amo = parseFloat(amount) * sell.price / buy.price;
      setSell({ ...sell, amount });
      setBuy({ ...buy, amount: `${amo.toFixed(4)}` });
    }
  };

  const changeBuyToken = (newToken: Token): void => setBuy({
    ...newToken, amount: '', price: 0, isEmpty: false,
  });
  const changeSellToken = (newToken: Token): void => setSell({
    ...newToken, amount: '', price: 0, isEmpty: false,
  });

  const onSwitch = (): void => {
    if (buy.isEmpty || isLoading) { return; }
    const subSellState = { ...sell };
    setSell({ ...buy});
    setBuy({ ...subSellState});
  };

  const onSwap = async (): Promise<void> => {
    if (!isValid) { return; }
    try {
      setIsSwapLoading(true);
      setStatus("Approving sell token");
      const sellAmount = calculateAmount(sell);
      const minBuyAmount = calculateAmountWithPercentage(buy, percentage);
      const reefswapRouter = getReefswapRouter(networkSettings, signer);
      await approveTokenAmount(sell, networkSettings.routerAddress, signer);

      setStatus("Executing swap")
      await reefswapRouter.swapExactTokensForTokens(
        sellAmount,
        minBuyAmount,
        [sell.address, buy.address],
        evmAddress,
        calculateDeadline(deadline),
      );
      toast.success('Swap complete!');
    } catch (error) {
      errorToast(error.message);
    } finally {
      const newTokens = await loadTokens(tokens, signer);
      dispatch(setAllTokensAction(newTokens));
      setIsSwapLoading(false);
      setStatus("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardHeaderBlank />
        <CardTitle title="Swap" />
        <CardSettings settings={settings} setSettings={setSettings} />
      </CardHeader>

      <TokenAmountField
        token={sell}
        id="sell-token-field"
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
        token={buy}
        id="buy-token-field"
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
          {isLoading ? <LoadingButtonIconWithText text={status} /> : text}
        </button>
      </div>
    </Card>
  );
};

export default SwapController;

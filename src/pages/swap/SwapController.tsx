import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getReefswapRouter } from '../../api/rpc/rpc';
import {
  loadTokens, TokenWithAmount, createEmptyTokenWithAmount, toTokenAmount, Token, approveTokenAmount,
} from '../../api/rpc/tokens';
import { ButtonStatus, SwitchTokenButton } from '../../components/buttons/Button';
import Card, {
  CardHeader, CardHeaderBlank, CardTitle,
} from '../../components/card/Card';
import CardSettings from '../../components/card/CardSettings';
import TokenAmountField from '../../components/card/TokenAmountField';
import TokenAmountView from '../../components/card/TokenAmountView';
import { ConfirmLabel } from '../../components/label/Labels';
import { LoadingButtonIconWithText } from '../../components/loading/Loading';
import ConfirmationModal from '../../components/modal/ConfirmationModal';
import { PoolHook } from '../../hooks/poolHook';
import { UpdateBalanceHook } from '../../hooks/updateBalanceHook';
import { setAllTokensAction } from '../../store/actions/tokens';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { defaultSettings, resolveSettings } from '../../store/internalStore';
import { errorToast } from '../../utils/errorHandler';
import {
  calculateAmount, calculateAmountWithPercentage, calculateDeadline, calculateUsdAmount, minimumRecieveAmount,
} from '../../utils/math';

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
  const { tokens } = useAppSelector((state) => state.tokens);
  const networkSettings = useAppSelector((state) => state.settings);
  const { accounts, selectedAccount } = useAppSelector((state) => state.accounts);
  const { signer, evmAddress, isEvmClaimed } = accounts[selectedAccount];

  const [buy, setBuy] = useState(createEmptyTokenWithAmount());
  const [sell, setSell] = useState(toTokenAmount(tokens[0], { amount: '', price: 0, index: 0 }));
  const [status, setStatus] = useState('');
  const [settings, setSettings] = useState(defaultSettings());
  const [isSwapLoading, setIsSwapLoading] = useState(false);

  const { percentage, deadline } = resolveSettings(settings);

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
  UpdateBalanceHook(buy, setBuy);
  UpdateBalanceHook(sell, setSell);

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
    setSell({ ...buy });
    setBuy({ ...subSellState });
  };

  const onSwap = async (): Promise<void> => {
    if (!isValid) { return; }
    try {
      setIsSwapLoading(true);
      setStatus(`Approving ${sell.name} token`);

      const sellAmount = calculateAmount(sell);
      const minBuyAmount = calculateAmountWithPercentage(buy, percentage);
      const reefswapRouter = getReefswapRouter(networkSettings, signer);
      await approveTokenAmount(sell, networkSettings.routerAddress, signer);

      setStatus('Executing swap');
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
      setStatus('');
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
      <SwitchTokenButton onClick={onSwitch} />
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
          // onClick={onSwap}
          disabled={!isValid || isLoading}
          data-bs-toggle="modal"
          data-bs-target="#swapModalToggle"
        >
          {isLoading ? <LoadingButtonIconWithText text={status} /> : text}
        </button>
      </div>
      <ConfirmationModal id="swapModalToggle" title="Confirm Swap" confirmFun={onSwap}>
        <TokenAmountView name={sell.name} amount={sell.amount} usdAmount={calculateUsdAmount(sell)} placeholder="From" />
        <SwitchTokenButton disabled />
        <TokenAmountView name={buy.name} amount={buy.amount} usdAmount={calculateUsdAmount(buy)} placeholder="To" />
        <div className="m-3">
          <ConfirmLabel title="Price" value={`1 ${buy.name} = ${(buy.price / sell.price).toFixed(4)} ${sell.name}`} />
        </div>
        <div className="field p-2 border-rad">
          <ConfirmLabel title="Liquidity Provider Fee" value="1.5 REEF" size="mini-text" />
          <ConfirmLabel title="Route" value={`${sell.name} > ${buy.name}`} size="mini-text" />
          <ConfirmLabel title="Minimum recieved" value={`${minimumRecieveAmount(buy, percentage).toFixed(4)} ${buy.name}`} size="mini-text" />
          <ConfirmLabel title="Slippage tolerance" value={`${percentage.toFixed(2)}%`} size="mini-text" />
        </div>

        <div className="mx-3 mt-3">
          <span className="mini-text text-muted d-inline-block">
            Output is estimated. You will receive at least
            <b>{`${minimumRecieveAmount(buy, percentage).toFixed(4)} ${buy.name}`}</b>
            {' '}
            or the transaction will revert.
          </span>
        </div>
      </ConfirmationModal>
    </Card>
  );
};

export default SwapController;

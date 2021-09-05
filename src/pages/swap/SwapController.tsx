import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { BigNumber } from 'ethers';
import { getReefswapRouter } from '../../api/rpc/rpc';
import {
  loadTokens, TokenWithAmount, createEmptyTokenWithAmount, toTokenAmount, Token, approveTokenAmount,
} from '../../api/rpc/tokens';
import { ButtonStatus, SwitchTokenButton } from '../../components/buttons/Button';
import Card, {
  CardHeader, CardHeaderBlank, CardTitle,
} from '../../components/card/Card';
import CardSettings from '../../components/card/CardSettings';
import TokenAmountField, { TokenAmountFieldImpactPrice, TokenAmountFieldMax } from '../../components/card/TokenAmountField';
import TokenAmountView from '../../components/card/TokenAmountView';
import { ConfirmLabel } from '../../components/label/Labels';
import { LoadingButtonIconWithText } from '../../components/loading/Loading';
import ConfirmationModal from '../../components/modal/ConfirmationModal';
import { LoadPoolHook } from '../../hooks/loadPoolHook';
import { UpdateBalanceHook } from '../../hooks/updateBalanceHook';
import { setAllTokensAction } from '../../store/actions/tokens';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { defaultSettings, resolveSettings } from '../../store/internalStore';
import { errorToast } from '../../utils/errorHandler';
import {
  calculateAmount, calculateAmountWithPercentage, calculateDeadline, calculateUsdAmount, ensureAmount, minimumRecieveAmount,
} from '../../utils/math';
import { ensure, errorStatus } from '../../utils/utils';
import { UpdateTokensPriceHook } from '../../hooks/updateTokensPriceHook';
import { ReefswapPool } from '../../api/rpc/pools';

const swapStatus = (sell: TokenWithAmount, buy: TokenWithAmount, isEvmClaimed: boolean, pool?: ReefswapPool): ButtonStatus => {
  if (!isEvmClaimed) {
    return errorStatus('Bind account');
  } if (sell.isEmpty) {
    return errorStatus('Select sell token');
  } if (buy.isEmpty) {
    return errorStatus('Select buy token');
  } if (!pool) {
    return errorStatus('Invalid pair');
  } if (sell.amount.length === 0) {
    return errorStatus(`Missing ${sell.name} amount`);
  } if (buy.amount.length === 0) {
    return errorStatus(`Missing ${buy.name} amount`);
  } if (BigNumber.from(calculateAmount(sell)).gt(sell.balance)) {
    return errorStatus(`Insufficient ${sell.name} token balance`);
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

  const { pool, isPoolLoading } = LoadPoolHook(sell, buy);

  const { text, isValid } = swapStatus(sell, buy, isEvmClaimed, pool);
  const isLoading = isSwapLoading || isPoolLoading;
  const { percentage, deadline } = resolveSettings(settings);

  // Updating user token balance.. its a bit hecky
  UpdateBalanceHook(buy, setBuy);
  UpdateBalanceHook(sell, setSell);
  UpdateTokensPriceHook({
    pool,
    token1: sell,
    token2: buy,
    setToken1: setSell,
    setToken2: setBuy,
  });

  const setAmount = (token1: TokenWithAmount, token2: TokenWithAmount, setToken1: (obj: TokenWithAmount) => void, setToken2: (obj: TokenWithAmount) => void) => (amount: string) => {
    if (amount === '') {
      setToken1({ ...token1, amount });
      setToken2({ ...token2, amount });
    } else {
      const amo = parseFloat(amount) * token1.price / token2.price;
      setToken1({ ...token1, amount });
      setToken2({ ...token2, amount: amo.toFixed(4) });
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
      ensureAmount(sell);

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

      <TokenAmountFieldMax
        token={sell}
        id="sell-token-field"
        onAmountChange={setAmount(sell, buy, setSell, setBuy)}
        onTokenSelect={changeSellToken}
      />
      <SwitchTokenButton onClick={onSwitch} />
      <TokenAmountFieldImpactPrice
        token={buy}
        id="buy-token-field"
        percentage={0.03214}
        onAmountChange={setAmount(buy, sell, setBuy, setSell)}
        onTokenSelect={changeBuyToken}
      />
      <div className="d-flex justify-content-center mt-2">
        <button
          type="button"
          data-bs-toggle="modal"
          disabled={!isValid || isLoading}
          data-bs-target="#swapModalToggle"
          className="btn btn-reef btn-lg border-rad w-100"
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
          <ConfirmLabel title="Liquidity Provider Fee" value="1.5 REEF" titleSize="mini-text" valueSize="mini-text" />
          <ConfirmLabel title="Route" value={`${sell.name} > ${buy.name}`} titleSize="mini-text" valueSize="mini-text" />
          <ConfirmLabel title="Minimum recieved" value={`${minimumRecieveAmount(buy, percentage).toFixed(4)} ${buy.name}`} titleSize="mini-text" valueSize="mini-text" />
          <ConfirmLabel title="Slippage tolerance" value={`${percentage.toFixed(2)}%`} titleSize="mini-text" valueSize="mini-text" />
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

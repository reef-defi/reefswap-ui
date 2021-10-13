import React, { useCallback, useMemo, useState } from 'react';
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
import { TokenAmountFieldImpactPrice, TokenAmountFieldMax } from '../../components/card/TokenAmountField';
import TokenAmountView from '../../components/card/TokenAmountView';
import { ConfirmLabel } from '../../components/label/Labels';
import { LoadingButtonIconWithText } from '../../components/loading/Loading';
import ConfirmationModal from '../../components/modal/ConfirmationModal';
import { useLoadPool } from '../../hooks/useLoadPool';
import { useUpdateBalance } from '../../hooks/useUpdateBalance';
import { setAllTokensAction } from '../../store/actions/tokens';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { defaultSettings, resolveSettings } from '../../store/internalStore';
import { errorToast } from '../../utils/errorHandler';
import {
  calculateAmount, calculateAmountWithPercentage, calculateDeadline, calculateImpactPercentage, calculateUsdAmount, convert2Normal, ensureAmount, getInputAmount, getOutputAmount, minimumRecieveAmount, transformAmount,
} from '../../utils/math';
import { ensure } from '../../utils/utils';
import { useUpdateTokensPrice } from '../../hooks/useUpdateTokensPrice';
import { ReefswapPool } from '../../api/rpc/pools';
import { SwapFocus, useUpdateSwapAmount } from '../../hooks/useUpdateAmount';

const swapStatus = (sell: TokenWithAmount, buy: TokenWithAmount, isEvmClaimed: boolean, pool?: ReefswapPool): ButtonStatus => {
  try {
    ensure(isEvmClaimed, 'Bind account');
    ensure(!sell.isEmpty, 'Select sell token');
    ensure(!buy.isEmpty, 'Select buy token');
    ensure(!!pool, 'Invalid pair');
    ensure(sell.amount.length !== 0, `Missing ${sell.name} amount`);
    ensure(buy.amount.length !== 0, `Missing ${buy.name} amount`);
    ensure(parseFloat(sell.amount) > 0, `Missing ${sell.name} amount`);
    ensure(parseFloat(sell.amount) <= convert2Normal(sell.decimals, sell.balance.toString()), `Insufficient ${sell.name} balance`);

    // Because of aboves ensure pool would not need explenation mark. Typescript broken...
    const {
      token1, token2, reserve1, reserve2,
    } = pool!;
    const amountOut1 = BigNumber.from(calculateAmount(sell));
    const amountOut2 = BigNumber.from(calculateAmount(buy));
    const reserved1 = BigNumber.from(reserve1);// .sub(amountOut1);
    const reserved2 = BigNumber.from(reserve2);// .sub(amountOut2);

    const amountIn1 = token1.balance.gt(reserved1.sub(amountOut1))
      ? token1.balance.sub(reserved1.sub(amountOut1))
      : BigNumber.from(0);

    const amountIn2 = token2.balance.gt(reserved2.sub(amountOut2))
      ? token2.balance.sub(reserved2.sub(amountOut2))
      : BigNumber.from(0);

    ensure(amountIn1.gt(0) || amountIn2.gt(0), 'Insufficient amounts');

    // WIP checking for ReefswapV2: K error
    // Temporary solution was with `swapExactTokensForTokensSupportingFeeOnTransferTokens` function!
    // Error still arives when using `swapExactTokensForTokens`

    // const balanceAdjuster1 = token1.balance.mul(1000).sub(amountIn1.mul(3));
    // const balanceAdjuster2 = token2.balance.mul(1000).sub(amountIn2.mul(3));

    // const reserved = reserved1.mul(reserved2).mul(1000 ** 2);
    // const balance = balanceAdjuster1.mul(balanceAdjuster2);
    // ensure(balance.gte(reserved), 'Deliquified pool');
    // ensure(amountOut1.eq(amountIn1) && amountOut2.eq(amountIn2), 'Deliquified pool')
    return { isValid: true, text: 'Swap' };
  } catch (e) {
    return { isValid: false, text: e.message };
  }
};

const loadingStatus = (status: string, isPoolLoading: boolean, isPriceLoading: boolean): string => {
  if (status) { return status; }
  if (isPoolLoading) { return 'Loading pool'; }
  if (isPriceLoading) { return 'Loading prices'; }
  return '';
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
  const [focus, setFocus] = useState<SwapFocus>('sell');

  const { pool, isPoolLoading } = useLoadPool(sell, buy);

  const { percentage, deadline } = resolveSettings(settings);
  const { text, isValid } = useMemo(
    () => swapStatus(sell, buy, isEvmClaimed, pool),
    [sell, buy, percentage, isEvmClaimed, pool],
  );

  useUpdateBalance(buy, setBuy);
  useUpdateBalance(sell, setSell);
  const isPriceLoading = useUpdateTokensPrice({
    pool,
    token1: sell,
    token2: buy,
    setToken1: setSell,
    setToken2: setBuy,
  });

  const isLoading = isSwapLoading || isPoolLoading || isPriceLoading;
  useUpdateSwapAmount({
    pool,
    focus,
    token2: buy,
    token1: sell,
    setToken2: setBuy,
    setToken1: setSell,
  });

  const setSellAmount = (amount: string): void => {
    if (isLoading) { return; }
    setFocus('sell');
    const amo = pool && amount !== ''
      ? getOutputAmount({ ...sell, amount }, pool).toFixed(4)
      : '';

    setSell({ ...sell, amount });
    setBuy({ ...buy, amount: amo });
  };
  const setBuyAmount = (amount: string): void => {
    if (isLoading) { return; }
    setFocus('buy');
    const amo = pool && amount !== ''
      ? getInputAmount({ ...buy, amount }, pool).toFixed(4)
      : '';

    setBuy({ ...buy, amount });
    setSell({ ...sell, amount: amo });
  };

  const onSwitch = (): void => {
    if (isLoading) { return; }
    if (focus === 'buy') {
      const subSell = { ...sell };
      setSell({ ...buy });
      setBuy({ ...subSell, amount: '', price: 0 });
      setFocus('sell');
    } else {
      const subBuy = { ...buy };
      setBuy({ ...sell });
      setSell({ ...subBuy, amount: '', price: 0 });
      setFocus('buy');
    }
  };

  const changeBuyToken = (newToken: Token): void => (newToken.address !== sell.address
    ? setBuy({
      ...newToken, amount: '', price: 0, isEmpty: false,
    })
    : onSwitch());
  const changeSellToken = (newToken: Token): void => (newToken.address !== buy.address
    ? setSell({
      ...newToken, amount: '', price: 0, isEmpty: false,
    })
    : onSwitch());

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
      await reefswapRouter.swapExactTokensForTokensSupportingFeeOnTransferTokens(
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
      // TODO move this out!
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
        onAmountChange={setSellAmount}
        onTokenSelect={changeSellToken}
      />
      <SwitchTokenButton onClick={onSwitch} />
      <TokenAmountFieldImpactPrice
        token={buy}
        id="buy-token-field"
        percentage={calculateImpactPercentage(sell, buy)}
        onAmountChange={setBuyAmount}
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
          {isLoading ? <LoadingButtonIconWithText text={loadingStatus(status, isPoolLoading, isPriceLoading)} /> : text}
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

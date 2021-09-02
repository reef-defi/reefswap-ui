import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { ButtonStatus, SwitchTokenButton } from '../../components/buttons/Button';
import Card, {
  CardBack, CardHeader, CardTitle,
} from '../../components/card/Card';
import TokenAmountField from '../../components/card/TokenAmountField';
import { LoadingButtonIconWithText } from '../../components/loading/Loading';
import { POOL_URL } from '../../utils/urls';
import { setAllTokensAction } from '../../store/actions/tokens';
import { setPools } from '../../store/actions/pools';
import { defaultSettings, resolveSettings } from '../../store/internalStore';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { errorToast } from '../../utils/errorHandler';
import { loadPools } from '../../api/rpc/pools';
import {
  TokenWithAmount, loadTokens, createEmptyTokenWithAmount, toTokenAmount, Token, approveTokenAmount,
} from '../../api/rpc/tokens';
import { PoolHook } from '../../hooks/poolHook';
import CardSettings from '../../components/card/CardSettings';
import { getReefswapRouter } from '../../api/rpc/rpc';
import {
  calculateAmount, calculateAmountWithPercentage, calculateDeadline, calculatePoolShare, calculatePoolSupply, calculateUsdAmount, minimumRecieveAmount,
} from '../../utils/math';
import { UpdateBalanceHook } from '../../hooks/updateBalanceHook';
import TokenAmountView from '../../components/card/TokenAmountView';
import { ConfirmLabel } from '../../components/label/Labels';
import ConfirmationModal from '../../components/modal/ConfirmationModal';
import { LoadPoolHook } from '../../hooks/loadPoolHook';

const errorStatus = (text: string): ButtonStatus => ({
  isValid: false,
  text,
});

const buttonStatus = (token1: TokenWithAmount, token2: TokenWithAmount, isEvmClaimed: boolean): ButtonStatus => {
  if (!isEvmClaimed) {
    return errorStatus('Bind account');
  } if (token1.isEmpty || token2.isEmpty) {
    return errorStatus('Invalid pair');
  } if (token1.amount.length === 0) {
    return errorStatus('Missing first token amount');
  } if (token2.amount.length === 0) {
    return errorStatus('Missing second token amount');
  }
  return { isValid: true, text: 'Supply' };
};

const AddLiquidity = (): JSX.Element => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const networkSettings = useAppSelector((state) => state.settings);
  const { tokens } = useAppSelector((state) => state.tokens);
  const { accounts, selectedAccount } = useAppSelector((state) => state.accounts);
  const { signer, evmAddress, isEvmClaimed } = accounts[selectedAccount];

  const [status, setStatus] = useState('');
  const [settings, setSettings] = useState(defaultSettings());
  const [isLiquidityLoading, setIsLiquidityLoading] = useState(false);

  const [token2, setToken2] = useState(createEmptyTokenWithAmount());
  const [token1, setToken1] = useState(toTokenAmount(tokens[0], { amount: '', price: 0, index: 0 }));
  const { deadline, percentage } = resolveSettings(settings);

  // TODO pool overhaed
  const { pool } = LoadPoolHook(token1, token2);
  const newPoolSupply = calculatePoolSupply(token1, token2, pool);

  UpdateBalanceHook(token1, setToken1);
  UpdateBalanceHook(token2, setToken2);

  const { isPoolLoading } = PoolHook({
    token1,
    token2,
    signer,
    settings: networkSettings,
    setToken1,
    setToken2,
  });

  const isLoading = isLiquidityLoading || isPoolLoading;
  const { text, isValid } = buttonStatus(token1, token2, isEvmClaimed);

  const back = (): void => history.push(POOL_URL);
  const changeToken1 = (newToken: Token): void => setToken1({
    ...newToken, amount: '', price: 0, isEmpty: false,
  });
  const changeToken2 = (newToken: Token): void => setToken2({
    ...newToken, amount: '', price: 0, isEmpty: false,
  });

  const setAmount1 = (amount: string): void => setToken1({ ...token1, amount });
  const setAmount2 = (amount: string): void => setToken2({ ...token2, amount });

  const addLiquidityClick = async (): Promise<void> => {
    try {
      setIsLiquidityLoading(true);
      setStatus(`Approving ${token1.name} token`);
      await approveTokenAmount(token1, networkSettings.routerAddress, signer);
      setStatus(`Approving ${token2.name} token`);
      await approveTokenAmount(token2, networkSettings.routerAddress, signer);

      setStatus('Adding supply');
      const reefswapRouter = getReefswapRouter(networkSettings, signer);

      await reefswapRouter.addLiquidity(
        token1.address,
        token2.address,
        calculateAmount(token1),
        calculateAmount(token2),
        calculateAmountWithPercentage(token1, percentage), // min amount token1
        calculateAmountWithPercentage(token2, percentage), // min amount token2
        evmAddress,
        calculateDeadline(deadline),
      );
      const pools = await loadPools(tokens, signer, networkSettings);
      dispatch(setPools(pools));
      toast.success(`${token1.name}/${token2.name} supply added successfully!`);
    } catch (error) {
      errorToast(error.message);
    } finally {
      const newTokens = await loadTokens(tokens, signer);
      dispatch(setAllTokensAction(newTokens));
      setIsLiquidityLoading(false);
      setStatus('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardBack onBack={back} />
        <CardTitle title="Add liquidity" />
        <CardSettings settings={settings} setSettings={setSettings} />
      </CardHeader>

      <div className="alert alert-danger mt-2 border-rad" role="alert">
        <b>Tip: </b>
        When you add liquidity, you will receive pool tokens representing your position. These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time.
      </div>

      <TokenAmountField
        token={token1}
        id="add-liquidity-token-1"
        onTokenSelect={changeToken1}
        onAmountChange={setAmount1}
      />
      <SwitchTokenButton disabled addIcon />
      <TokenAmountField
        token={token2}
        id="add-liquidity-token-2"
        onTokenSelect={changeToken2}
        onAmountChange={setAmount2}
      />

      <button
        type="button"
        className="btn btn-reef btn-lg border-rad w-100 mt-2"
        disabled={!isValid || isLoading}
        data-bs-toggle="modal"
        data-bs-target="#supplyModalToggle"
      >
        {isLoading ? <LoadingButtonIconWithText text={status} /> : text}
      </button>

      <ConfirmationModal id="supplyModalToggle" title="Confirm Supply" confirmFun={addLiquidityClick}>
        <label className="text-muted ms-2">You will recieve</label>
        <div className="field border-rad p-3">
          <ConfirmLabel
            titleSize="h4"
            valueSize="h6"
            title={newPoolSupply.toFixed(8)}
            value={`${token1.name}/${token2.name}`}
          />
        </div>
        <div className="m-3">
          <span className="mini-text text-muted d-inline-block">
            Output is estimated. If the price changes by more than
            {' '}
            {percentage}
            % your transaction will revert.
          </span>
        </div>
        <div className="field p-2 border-rad">
          <ConfirmLabel title="Liquidity Provider Fee" value="1.5 REEF" titleSize="mini-text" valueSize="mini-text" />
          <ConfirmLabel title={`${token1.name} Deposited`} value={`${token1.amount}`} titleSize="mini-text" valueSize="mini-text" />
          <ConfirmLabel title={`${token2.name} Deposited`} value={`${token2.amount}`} titleSize="mini-text" valueSize="mini-text" />
          <ConfirmLabel title="Rates" value={`1 ${token1.name} = ${(token1.price / token2.price).toFixed(8)} ${token2.name}`} titleSize="mini-text" valueSize="mini-text" />
          <ConfirmLabel title="" value={`1 ${token2.name} = ${(token2.price / token1.price).toFixed(8)} ${token1.name}`} titleSize="mini-text" valueSize="mini-text" />
          <ConfirmLabel title="Share of Pool" value={`${(calculatePoolShare(pool) * 100).toFixed(8)} %`} titleSize="mini-text" valueSize="mini-text" />
        </div>

      </ConfirmationModal>
    </Card>
  );
};

export default AddLiquidity;

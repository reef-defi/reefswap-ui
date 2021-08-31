import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { ButtonStatus } from '../../components/buttons/Button';
import Card, {
  CardBack, CardHeader, CardSettings, CardTitle,
} from '../../components/card/Card';
import TokenAmountField from '../../components/card/TokenAmountField';
import { LoadingButtonIcon } from '../../components/loading/Loading';
import { POOL_URL } from '../../utils/urls';
import { setAllTokensAction } from '../../store/actions/tokens';
import { setPools } from '../../store/actions/pools';
import { defaultGasLimit, defaultSettings } from '../../store/internalStore';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { errorToast } from '../../utils/errorHandler';
import { loadPools } from '../../api/rpc/pools';
import {
  TokenWithAmount, addLiquidity, loadTokens, createEmptyTokenWithAmount, toTokenAmount, Token,
} from '../../api/rpc/tokens';
import { PoolHook } from '../../hooks/poolHook';

const errorStatus = (text: string): ButtonStatus => ({
  isValid: false,
  text,
});

const buttonStatus = (token1: TokenWithAmount, token2: TokenWithAmount, isEvmClaimed: boolean, poolError?: string): ButtonStatus => {
  if (!isEvmClaimed) {
    return errorStatus('Bind account');
  } if (token1.isEmpty) {
    return errorStatus('Select first token');
  } if (token2.isEmpty) {
    return errorStatus('Select second token');
  } if (poolError) {
    return errorStatus(poolError);
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
  const { signer, isEvmClaimed } = accounts[selectedAccount];

  const [isLiquidityLoading, setIsLiquidityLoading] = useState(false);
  const [settings, setSettings] = useState(defaultSettings());

  const [token2, setToken2] = useState(createEmptyTokenWithAmount());
  const [token1, setToken1] = useState(toTokenAmount(tokens[0], { amount: '', price: 0, index: 0 }));

  const { poolError, isPoolLoading } = PoolHook({
    token1,
    token2,
    signer,
    settings: networkSettings,
    percentage: settings.percentage,
    setToken1,
    setToken2,
  });

  const isLoading = isLiquidityLoading || isPoolLoading;
  const { text, isValid } = buttonStatus(token1, token2, isEvmClaimed, poolError);

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
      await addLiquidity(token1, token2, signer, networkSettings, settings.gasLimit);
      const pools = await loadPools(tokens, signer, networkSettings);
      dispatch(setPools(pools));
      toast.success(`${token1.name}/${token2.name} liquidity added successfully!`);
    } catch (error) {
      errorToast(error.message);
    } finally {
      const newTokens = await loadTokens(tokens, signer);
      dispatch(setAllTokensAction(newTokens));
      setIsLiquidityLoading(false);
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
      <div className="d-flex justify-content-center">
        <div className="btn-content-field border-rad">
          <button type="button" disabled className="btn btn-field">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
            </svg>
          </button>
        </div>
      </div>

      <TokenAmountField
        token={token2}
        id="add-liquidity-token-2"
        onTokenSelect={changeToken2}
        onAmountChange={setAmount2}
      />

      <button
        type="button"
        className="btn btn-reef border-rad w-100 mt-2"
        disabled={!isValid || isLoading}
        onClick={addLiquidityClick}
      >
        {isLoading ? <LoadingButtonIcon /> : text}
      </button>
    </Card>
  );
};

export default AddLiquidity;

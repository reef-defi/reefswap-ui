import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import {
  addLiquidity, reloadTokens, TokenWithAmount, toTokenAmount,
} from '../../api/tokens';
import { ButtonStatus } from '../../components/buttons/Button';
import Card, { CardBack, CardHeader, CardSettings, CardTitle } from '../../components/card/Card';
import TokenAmountField from '../../components/card/TokenAmountField';
import { LoadingButtonIcon } from '../../components/loading/Loading';
import { POOL_URL } from '../../utils/urls';
import { setAllTokensAction } from '../../store/actions/tokens';
import { loadPools } from '../../api/pools';
import { setPools } from '../../store/actions/pools';
import { defaultGasLimit, defaultTokenState } from '../../store/internalStore';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

const buttonStatus = (token1: TokenWithAmount, token2: TokenWithAmount, isEvmClaimed: boolean): ButtonStatus => {
  if (!isEvmClaimed) {
    return { isValid: false, text: "Bind account"};
  } else if (token1.amount.length === 0) {
    return { isValid: false, text: 'Missing first token amount' };
  } else if (token2.amount.length === 0) {
    return { isValid: false, text: 'Missing second token amount' };
  } else {
    return { isValid: true, text: 'Add liquidity' };
  }
};

const AddLiquidity = (): JSX.Element => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { tokens } = useAppSelector((state) => state.tokens);
  const { accounts, selectedAccount } = useAppSelector((state) => state.accounts);

  const [isLoading, setIsLoading] = useState(false);
  const [pointer1, setPointer1] = useState(defaultTokenState());
  const [pointer2, setPointer2] = useState(defaultTokenState(1));
  const [gasLimit, setGasLimit] = useState(defaultGasLimit());

  const token1 = toTokenAmount(tokens[pointer1.index], pointer1.amount);
  const token2 = toTokenAmount(tokens[pointer2.index], pointer2.amount);
  const { signer, isEvmClaimed } = accounts[selectedAccount];
  const { text, isValid } = buttonStatus(token1, token2, isEvmClaimed);

  const back = (): void => history.push(POOL_URL);
  const changeToken1 = (index: number): void => setPointer1({ ...pointer1, index });
  const changeToken2 = (index: number): void => setPointer2({ ...pointer2, index });

  const setAmount1 = (amount: string): void => setPointer1({ ...pointer1, amount });
  const setAmount2 = (amount: string): void => setPointer2({ ...pointer2, amount });

  const addLiquidityClick = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await addLiquidity(token1, token2, signer);
      const pools = await loadPools(tokens, signer);
      dispatch(setPools(pools));
      history.push(POOL_URL);
      toast.success(`${token1.name}/${token2.name} liquidity added successfully!`);
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
        <CardBack onBack={back} />
        <CardTitle title="Add liquidity" />
        <CardSettings settings={{ gasLimit, setGasLimit }} />
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

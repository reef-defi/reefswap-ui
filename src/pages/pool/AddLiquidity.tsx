import React, { useEffect, useState } from 'react';
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
import { defaultGasLimit } from '../../store/internalStore';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { errorToast } from '../../utils/errorHandler';
import { loadPools, poolContract } from '../../api/rpc/pools';
import {
  TokenWithAmount, addLiquidity, loadTokens, createEmptyTokenWithAmount, toTokenAmount,
} from '../../api/rpc/tokens';
import { retrieveReefCoingeckoPrice } from '../../api/prices';
import { poolRatio } from '../../utils/math';

const buttonStatus = (token1: TokenWithAmount, token2: TokenWithAmount, isEvmClaimed: boolean): ButtonStatus => {
  if (!isEvmClaimed) {
    return { isValid: false, text: 'Bind account' };
  } if (token1.isEmpty) {
    return { isValid: false, text: 'Select first token'};
  } if (token2.isEmpty) {
    return { isValid: false, text: 'Select second token'};
  } if (token1.amount.length === 0) {
    return { isValid: false, text: 'Missing first token amount' };
  } if (token2.amount.length === 0) {
    return { isValid: false, text: 'Missing second token amount' };
  }
  return { isValid: true, text: 'Supply' };
};

const AddLiquidity = (): JSX.Element => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);
  const { tokens } = useAppSelector((state) => state.tokens);
  const { accounts, selectedAccount } = useAppSelector((state) => state.accounts);

  const [isLiquidityLoading, setIsLiquidityLoading] = useState(false);
  const [gasLimit, setGasLimit] = useState(defaultGasLimit());

  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const [token2, setToken2] = useState(createEmptyTokenWithAmount());
  const [token1, setToken1] = useState(toTokenAmount(tokens[0], {amount: "", price: 0, index: 0}));

  const isLoading = isLiquidityLoading || isPriceLoading;
  const { signer, isEvmClaimed } = accounts[selectedAccount];
  const { text, isValid } = buttonStatus(token1, token2, isEvmClaimed);

  useEffect(() => {
    const load = async () => {
      if (token1.isEmpty ||token2.isEmpty) { return; }
      try {
        setIsPriceLoading(true);
        const reefPrice = await retrieveReefCoingeckoPrice();
        const basePool = await poolContract(token1, token2, signer, settings);
        const baseRatio = poolRatio(basePool);

        if (token1.name === "REEF") {
          setToken1({...token1, price: reefPrice});
          setToken2({...token2, price: reefPrice/baseRatio});
        } else if (token2.name === "REEF") {
          setToken1({...token1, price: reefPrice*baseRatio});
          setToken2({...token2, price: reefPrice});
        } else {
          const sellPool = await poolContract(tokens[0], token1, signer, settings);
          const sellRatio = poolRatio(sellPool);
          setToken1({...token1, price: reefPrice/sellRatio});
          setToken2({...token2, price: reefPrice/sellRatio*baseRatio});
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsPriceLoading(false);
      }
    };
    load();
  }, [token1.address, token2.address]);

  const back = (): void => history.push(POOL_URL);
  const changeToken1 = (index: number): void => setToken1({
    ...tokens[index], amount: '', price: 0, index, isEmpty: false,
  });
  const changeToken2 = (index: number): void => setToken2({
    ...tokens[index], amount: '', price: 0, index, isEmpty: false,
  });

  const setAmount1 = (amount: string): void => {
    // if (amount === "") {
    //   setToken1({...token1, amount: ''});
    //   setToken2({...token2, amount: ''});
    // } else {
      // const amo = parseFloat(amount)*token1.price/token2.price;
      setToken1({ ...token1, amount });
    //   setToken2({...token2, amount: `${amo.toFixed(4)}`});
    // }
  };
  const setAmount2 = (amount: string): void => {
    // if (amount === "") {
    //   setToken1({...token1, amount: ''});
    //   setToken2({...token2, amount: ''});
    // } else {
    //   const amo = parseFloat(amount)*token2.price/token1.price;
    //   setToken1({...token1, amount: `${amo.toFixed(4)}`});
      setToken2({ ...token2, amount });
    // }
  };

  const addLiquidityClick = async (): Promise<void> => {
    try {
      setIsLiquidityLoading(true);
      await addLiquidity(token1, token2, signer, settings, gasLimit);
      const pools = await loadPools(tokens, signer, settings);
      dispatch(setPools(pools));
      back();
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

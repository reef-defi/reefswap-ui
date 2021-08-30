import { Signer } from '@reef-defi/evm-provider';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getTokenPrice, retrieveReefCoingeckoPrice } from '../../api/prices';
import { poolContract, ReefswapPool } from '../../api/rpc/pools';
import { swapTokens, loadTokens, TokenWithAmount, createEmptyTokenWithAmount, toTokenAmount, Token } from '../../api/rpc/tokens';
import { ButtonStatus } from '../../components/buttons/Button';
import Card, {
  CardHeader, CardHeaderBlank, CardSettings, CardTitle,
} from '../../components/card/Card';
import { DownArrowIcon } from '../../components/card/Icons';
import TokenAmountField from '../../components/card/TokenAmountField';
import { LoadingButtonIcon } from '../../components/loading/Loading';
import { reefPriceHook } from '../../hooks/reefPriceHook';
import { setAllTokensAction } from '../../store/actions/tokens';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { defaultGasLimit } from '../../store/internalStore';
import { errorToast } from '../../utils/errorHandler';

const swapStatus = (sell: TokenWithAmount, buy: TokenWithAmount, isEvmClaimed: boolean): ButtonStatus => {
  if (!isEvmClaimed) {
    return { isValid: false, text: 'Bind account' };
  } if (sell.isEmpty) {
    return { isValid: false, text: 'Select sell token'};
  } if (buy.isEmpty) {
    return { isValid: false, text: 'Select buy token'};
  } if (sell.amount.length === 0) {
    return { isValid: false, text: 'Missing sell amount' };
  } if (buy.amount.length === 0) {
    return { isValid: false, text: 'Missing buy amount' };
  }
  return { isValid: true, text: 'Swap' };
};

const toBalance = ({balance, decimals}: Token): number => {
  const num = balance.toString();
  const diff = num.length-decimals;
  const fullNum = diff <= 0 
    ? "0" 
    : num.slice(0, diff);
  return parseFloat(`${fullNum}.${num.slice(diff, num.length)}`);
}

const poolRatio = ({token1, token2}: ReefswapPool): number => 
  toBalance(token1)/toBalance(token2);

const SwapController = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);
  const { tokens } = useAppSelector((state) => state.tokens);
  const { accounts, selectedAccount } = useAppSelector((state) => state.accounts);
  const { signer, isEvmClaimed } = accounts[selectedAccount];


  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const [buy, setBuy] = useState(createEmptyTokenWithAmount());
  const [sell, setSell] = useState(toTokenAmount(tokens[0], {amount: "", price: 0, index: 0}));

  const [gasLimit, setGasLimit] = useState(defaultGasLimit());
  const [isSwapLoading, setIsSwapLoading] = useState(false);

  const { text, isValid } = swapStatus(sell, buy, isEvmClaimed);
  const isLoading = isSwapLoading || isPriceLoading;

  useEffect(() => {
    const load = async () => {
      if (sell.isEmpty || buy.isEmpty) { return; }
      try {
        setIsPriceLoading(true);
        const reefPrice = await retrieveReefCoingeckoPrice();
        const basePool = await poolContract(sell, buy, signer, settings);
        const baseRatio = poolRatio(basePool);

        if (sell.name === "REEF") {
          setSell({...sell, price: reefPrice});
          setBuy({...buy, price: reefPrice/baseRatio});
        } else if (buy.name === "REEF") {
          setBuy({...buy, price: reefPrice});
          setSell({...sell, price: reefPrice*baseRatio});
        } else {
          const sellPool = await poolContract(tokens[0], sell, signer, settings);
          const sellRatio = poolRatio(sellPool);
          setSell({...sell, price: reefPrice/sellRatio});
          setBuy({...buy, price: reefPrice/sellRatio*baseRatio});
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsPriceLoading(false);
      }
    };
    load();
  }, [buy.address, sell.address]);

  const setBuyAmount = (amount: string): void => {
    if (amount === "") {
      setSell({...sell, amount});
      setBuy({...buy, amount})
    } else {
      const amo = parseFloat(amount)*buy.price/sell.price;
      setBuy({ ...buy, amount });
      setSell({...sell, amount: `${amo.toFixed(4)}`})
    }
  }
  const setSellAmount = (amount: string): void => {
    if (amount === "") {
      setSell({...sell, amount});
      setBuy({...buy, amount})
    } else {
      const amo = parseFloat(amount)*sell.price/buy.price;
      setSell({ ...sell, amount });
      setBuy({...buy, amount: `${amo.toFixed(4)}`});
    }
  }

  const changeBuyToken = (index: number): void => setBuy({
    ...tokens[index], index, amount: '', price: 0, isEmpty: false,
  });
  const changeSellToken = (index: number): void => setSell({
    ...tokens[index], index, amount: '', price: 0, isEmpty: false,
  });

  const onSwitch = (): void => {
    if (buy.isEmpty) { return; }
    const subBuyState = { ...buy };
    setBuy({ ...sell });
    setSell({ ...subBuyState });
  };

  const onSwap = async (): Promise<void> => {
    try {
      setIsSwapLoading(true);
      await swapTokens(sell!, buy!, signer, settings, gasLimit);
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
          {isLoading ? <LoadingButtonIcon /> : text}
        </button>
      </div>
    </Card>
  );
};

export default SwapController;

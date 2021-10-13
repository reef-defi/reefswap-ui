import { useState, useEffect } from 'react';
import { ReefswapPool } from '../api/rpc/pools';
import { TokenWithAmount } from '../api/rpc/tokens';
import {
  assertAmount, getInputAmount, getOutputAmount,
} from '../utils/math';

export type SwapFocus = 'buy' | 'sell';

interface UpdateAmountHookInput {
  pool?: ReefswapPool;
  token1: TokenWithAmount;
  token2: TokenWithAmount;
  setToken1: (value: TokenWithAmount) => void;
  setToken2: (value: TokenWithAmount) => void;
}

interface SwapAmountHookInput extends UpdateAmountHookInput {
  focus: SwapFocus;
}

export const useUpdateSwapAmount = ({
  pool, token2, token1, setToken1: setSell, setToken2: setBuy, focus,
}: SwapAmountHookInput): void => {
  useEffect(() => {
    if (!pool || token2.price === 0 || token1.price === 0) { return; }

    if (focus === 'sell') {
      setBuy({ ...token2, amount: getOutputAmount(token1, pool).toFixed(4) });
    } else {
      setSell({ ...token1, amount: getInputAmount(token2, pool).toFixed(4) });
    }
  }, [token2.price, token1.price]);
};

export const useUpdateLiquidityAmount = ({
  pool, token1, token2, setToken1, setToken2,
}: UpdateAmountHookInput): void => {
  const [prevAddress1, setPrevAddress1] = useState(token1.address);
  const [prevAddress2, setPrevAddress2] = useState(token2.address);

  useEffect(() => {
    if (!pool || token1.price === 0 || token2.price === 0) { return; }

    const ratio = token2.price / token1.price;
    if (token1.address !== prevAddress1) {
      const amount = parseFloat(assertAmount(token2.amount)) * ratio;
      setToken1({ ...token1, amount: amount === 0 ? '' : amount.toFixed(4) });
    } else if (token2.address !== prevAddress2) {
      const amount = parseFloat(assertAmount(token1.amount)) / ratio;
      setToken2({ ...token2, amount: amount === 0 ? '' : amount.toFixed(4) });
    }
    setPrevAddress1(token1.address);
    setPrevAddress2(token2.address);
  }, [token1.price, token2.price]);
};

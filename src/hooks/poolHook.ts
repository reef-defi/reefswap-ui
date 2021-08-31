import { Signer } from '@reef-defi/evm-provider';
import React, { useEffect, useRef, useState } from 'react';
import { retrieveReefCoingeckoPrice } from '../api/prices';
import { poolContract } from '../api/rpc/pools';
import { ReefNetwork } from '../api/rpc/rpc';
import { TokenWithAmount } from '../api/rpc/tokens';
import { useAppSelector } from '../store/hooks';
import { poolRatio } from '../utils/math';

interface PoolHookInput {
  signer: Signer;
  settings: ReefNetwork;
  token1: TokenWithAmount;
  token2: TokenWithAmount;
  percentage: number;
  setToken1: (token: TokenWithAmount) => void;
  setToken2: (token: TokenWithAmount) => void;
}
interface PoolHookOutput {
  poolError?: string;
  isPoolLoading: boolean;
}

const ensureAndExecute = (condition: boolean) => <T, >(fun: (value: T) => void, obj: T): void => {
  if (condition) {
    fun(obj);
  }
};

const calculateNewTokenAmount = (amount: string, tokenPrice1: number, tokenPrice2: number, percentage = 1): string => {
  if (!amount) {
    return amount;
  }
  const newAmount = parseFloat(amount) * tokenPrice1 / tokenPrice2 * percentage;
  return newAmount.toFixed(4);
};

export const PoolHook = ({
  token1, token2, signer, settings, percentage, setToken1, setToken2,
}: PoolHookInput): PoolHookOutput => {
  const mounted = useRef(true);
  const { tokens } = useAppSelector((state) => state.tokens);
  const [isLoading, setIsLoading] = useState(false);
  const [prevAddress1, setPrevAddress1] = useState(token1.address);
  const [prevAddress2, setPrevAddress2] = useState(token2.address);
  const [error, setError] = useState('');

  const ensureMount = ensureAndExecute(mounted.current);

  const updateTokens = (tokenPrice1: number, tokenPrice2: number): void => {
    ensureMount(setToken1, {
      ...token1,
      price: tokenPrice1,
      amount: token1.address !== prevAddress1
        ? calculateNewTokenAmount(token2.amount, tokenPrice2, tokenPrice1, 2 - percentage)
        : token1.amount,
    });
    ensureMount(setToken2, {
      ...token2,
      price: tokenPrice2,
      amount: token2.address !== prevAddress2
        ? calculateNewTokenAmount(token1.amount, tokenPrice1, tokenPrice2, percentage)
        : token2.amount,
    });
  };

  useEffect(() => {
    const load = async (): Promise<void> => {
      if (token1.isEmpty || token2.isEmpty) { return; }
      try {
        mounted.current = true;
        setError('');
        setIsLoading(true);
        const reefPrice = await retrieveReefCoingeckoPrice();
        const basePool = await poolContract(token1, token2, signer, settings);
        const baseRatio = poolRatio(basePool);

        if (token1.name === 'REEF') {
          updateTokens(reefPrice, reefPrice / baseRatio);
        } else if (token2.name === 'REEF') {
          updateTokens(reefPrice * baseRatio, reefPrice);
        } else {
          const sellPool = await poolContract(tokens[0], token1, signer, settings);
          const sellRatio = poolRatio(sellPool);
          updateTokens(reefPrice / sellRatio, reefPrice / sellRatio * baseRatio);
        }
      } catch (e) {
        // TODO not totally appropriet error handling...
        ensureMount(setError, 'Pool does not exist');
      } finally {
        ensureMount(setPrevAddress1, token1.address);
        ensureMount(setPrevAddress2, token2.address);
        ensureMount(setIsLoading, false);
      }
    };
    load();

    return () => {
      mounted.current = false;
    };
  }, [token1.address, token2.address]);

  return {
    isPoolLoading: isLoading,
    poolError: !error ? undefined : error,
  };
};

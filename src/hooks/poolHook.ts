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
  setToken1: (token: TokenWithAmount) => void;
  setToken2: (token: TokenWithAmount) => void;
}
interface PoolHookOutput {
  poolError?: string;
  isPoolLoading: boolean;
}

export const PoolHook = ({
  token1, token2, signer, settings, setToken1, setToken2,
}: PoolHookInput): PoolHookOutput => {
  const mounted = useRef(true);
  const { tokens } = useAppSelector((state) => state.tokens);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async (): Promise<void> => {
      if (token1.isEmpty || token2.isEmpty) { return; }
      try {
        setError('');
        setIsLoading(true);
        const reefPrice = await retrieveReefCoingeckoPrice();
        const basePool = await poolContract(token1, token2, signer, settings);
        const baseRatio = poolRatio(basePool);

        if (mounted) {
          if (token1.name === 'REEF') {
            setToken1({ ...token1, price: reefPrice });
            setToken2({ ...token2, price: reefPrice / baseRatio });
          } else if (token2.name === 'REEF') {
            setToken1({ ...token1, price: reefPrice * baseRatio });
            setToken2({ ...token2, price: reefPrice });
          } else {
            const sellPool = await poolContract(tokens[0], token1, signer, settings);
            const sellRatio = poolRatio(sellPool);
            setToken1({ ...token1, price: reefPrice / sellRatio });
            setToken2({ ...token2, price: reefPrice / sellRatio * baseRatio });
          }
        }
      } catch (e) {
        setError('Pool does not exist');
      } finally {
        setIsLoading(false);
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

import { useEffect, useRef, useState } from 'react';
import { retrieveReefCoingeckoPrice } from '../api/prices';
import { poolContract, ReefswapPool } from '../api/rpc/pools';
import { TokenWithAmount } from '../api/rpc/tokens';
import { useAppSelector } from '../store/hooks';
import { poolRatio } from '../utils/math';
import { ensureVoidRun } from '../utils/utils';

interface UpdateTokensPriceHook {
  pool?: ReefswapPool;
  token1: TokenWithAmount;
  token2: TokenWithAmount;
  setToken1: (token: TokenWithAmount) => void;
  setToken2: (token: TokenWithAmount) => void;
}

export const useUpdateTokensPrice = ({
  pool, token1, token2, setToken1, setToken2,
}: UpdateTokensPriceHook): boolean => {
  const settings = useAppSelector((state) => state.settings);
  const { tokens } = useAppSelector((state) => state.tokens);
  const { accounts, selectedAccount } = useAppSelector((state) => state.accounts);

  const mounted = useRef(true);
  const { signer } = accounts[selectedAccount];
  const [isLoading, setIsLoading] = useState(false);
  const ensureMount = ensureVoidRun(mounted.current);

  const updateTokens = (tokenPrice1: number, tokenPrice2: number): void => {
    ensureMount(setToken1, { ...token1, price: tokenPrice1 });
    ensureMount(setToken2, { ...token2, price: tokenPrice2 });
  };

  useEffect(() => {
    const load = async (): Promise<void> => {
      if (!pool) { return; }
      try {
        mounted.current = true;
        setIsLoading(true);
        const reefPrice = await retrieveReefCoingeckoPrice();
        const baseRatio = poolRatio(pool);

        if (token1.name === 'REEF') {
          updateTokens(reefPrice, reefPrice / baseRatio);
        } else if (token2.name === 'REEF') {
          updateTokens(reefPrice / baseRatio, reefPrice);
        } else {
          const sellPool = await poolContract(tokens[0], token1, signer, settings);
          const sellRatio = poolRatio(sellPool);
          updateTokens(reefPrice / sellRatio, reefPrice / sellRatio * baseRatio);
        }
      } catch (error) {
        console.error(error);
        updateTokens(0, 0);
      } finally {
        ensureMount(setIsLoading, false);
      }
    };
    load();
  }, [pool]);

  return isLoading;
};

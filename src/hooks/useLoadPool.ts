import { useEffect, useRef, useState } from 'react';
import { poolContract, ReefswapPool } from '../api/rpc/pools';
import { Token } from '../api/rpc/tokens';
import { useAppSelector } from '../store/hooks';
import { ensureVoidRun } from '../utils/utils';

interface LoadPoolHookOutput {
  pool?: ReefswapPool;
  isPoolLoading: boolean;
}

export const useLoadPool = (token1: Token, token2: Token): LoadPoolHookOutput => {
  const networkSettings = useAppSelector((state) => state.settings);
  const { accounts, selectedAccount } = useAppSelector((state) => state.accounts);

  const [pool, setPool] = useState<ReefswapPool>();
  const [isLoading, setIsLoading] = useState(false);

  const { signer } = accounts[selectedAccount];

  useEffect(() => {
    const load = async (): Promise<void> => {
      if (!token1.address || !token2.address) { return; }
      try {
        setIsLoading(true);
        const foundPool = await poolContract(token1, token2, signer, networkSettings);
        setPool(foundPool);
      } catch (e) {
        setPool(undefined);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [token1.address, token2.address, token1.balance, token2.balance]);

  return { pool, isPoolLoading: isLoading };
};

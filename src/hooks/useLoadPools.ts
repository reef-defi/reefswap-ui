import { useEffect, useRef, useState } from 'react';
import { loadPools, poolContract, ReefswapPool } from '../api/rpc/pools';
import { Token } from '../api/rpc/tokens';
import { useAppSelector } from '../store/hooks';
import { ensureVoidRun } from '../utils/utils';

interface LoadPoolHookOutput {
  pools: ReefswapPool[];
  isLoading: boolean;
}

export const useLoadPools = (tokens: Token[]): [ReefswapPool[], boolean] => {
  const mounted = useRef(true);
  const networkSettings = useAppSelector((state) => state.settings);
  const { accounts, selectedAccount } = useAppSelector((state) => state.accounts);

  const [pools, setPools] = useState<ReefswapPool[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { signer } = accounts[selectedAccount];
  const ensureMounted = ensureVoidRun(mounted.current);

  useEffect(() => {
    const load = async (): Promise<void> => Promise.resolve()
      .then(() => { mounted.current = true; })
      .then(() => setIsLoading(true))
      .then(() => loadPools(tokens, signer, networkSettings))
      .then((res) => ensureMounted(setPools, res))
      .catch(() => ensureMounted(setPools, []))
      .finally(() => ensureMounted(setIsLoading, false));

    load();
    return () => {
      mounted.current = false;
    };
  }, [tokens]);

  return [pools, isLoading];
};

import { useEffect, useRef, useState } from "react";
import { poolContract, ReefswapPool } from "../api/rpc/pools";
import { TokenWithAmount } from "../api/rpc/tokens";
import { useAppSelector } from "../store/hooks";

interface LoadPoolHookOutput {
  pool?: ReefswapPool;
  isLoading: boolean;
}

export const LoadPoolHook = (token1: TokenWithAmount, token2: TokenWithAmount): LoadPoolHookOutput => {
  const mounted = useRef(true);

  const networkSettings = useAppSelector((state) => state.settings);
  const {accounts, selectedAccount} = useAppSelector((state) => state.accounts);
  
  const [pool, setPool] = useState<ReefswapPool>();
  const [isLoading, setIsLoading] = useState(false);

  const {signer} = accounts[selectedAccount];

  const ensureMounted = <T,>(fun: (obj: T) => void, obj: T) => 
    mounted.current && fun(obj);

  useEffect(() => {
    if (token1.isEmpty || token2.isEmpty) { return; }

    const load = async () => {
      try {
        mounted.current = true;
        setIsLoading(true);
        const foundPool = await poolContract(token1, token2, signer, networkSettings);
        ensureMounted(setPool, foundPool);
      } catch (e) {
        setPool(undefined);
      } finally {
        ensureMounted(setIsLoading, false);
      }
    };

    load();

    return () => {
      mounted.current = false;
    }
  }, [token1.address, token2.address]);

  return {pool, isLoading};
}
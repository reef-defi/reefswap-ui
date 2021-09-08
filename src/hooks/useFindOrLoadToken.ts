import { useEffect, useRef, useState } from 'react';
import { createEmptyToken, loadToken, Token } from '../api/rpc/tokens';
import { useAppSelector } from '../store/hooks';

export const useFindOrLoadToken = (address: string): [Token, boolean] => {
  const { tokens } = useAppSelector((state) => state.tokens);
  const { accounts, selectedAccount } = useAppSelector((state) => state.accounts);

  const mounted = useRef(true);
  const [token, setToken] = useState(createEmptyToken());
  const [isLoading, setIsLoading] = useState(false);

  const ensureMount = <T, >(fun: (obj: T) => void, obj: T): void => {
    mounted.current && fun(obj);
  };

  useEffect(() => {
    const load = async (): Promise<void> => {
      if (!address || selectedAccount === -1) { return; }
      const { signer } = accounts[selectedAccount];

      const existingTokens = tokens
        .filter((existingToken) => existingToken.address === address);

      if (existingTokens.length > 0) {
        setToken(existingTokens[0]);
        return;
      }
      Promise.resolve()
        .then(() => { mounted.current = true; })
        .then(() => setIsLoading(true))
        .then(() => loadToken(address, signer, ''))
        .then((res) => ensureMount(setToken, res))
        .catch(() => ensureMount(setToken, createEmptyToken()))
        .finally(() => ensureMount(setIsLoading, false));
    };

    load();
    return () => {
      mounted.current = false;
    };
  }, [address]);

  return [token, isLoading];
};

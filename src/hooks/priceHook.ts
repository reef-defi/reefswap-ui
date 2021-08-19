import { useEffect, useRef, useState } from 'react';
import { getTokenPrice } from '../api/prices';
import { TokenWithAmount, toTokenAmount } from '../api/rpc/tokens';
import { useAppSelector } from '../store/hooks';
import { defaultTokenState } from '../store/internalStore';

export const PriceHook = (tokenIndex: number): [TokenWithAmount, boolean, (value: TokenWithAmount) => void] => {
  const { tokens } = useAppSelector((state) => state.tokens);

  const isMounted = useRef(true);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(defaultTokenState(tokenIndex));

  const pointer = { ...tokens[token.index] };

  useEffect(() => {
    return () => {
      isMounted.current = false;
    }
  }, []);

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        setIsLoading(true);
        console.log("Loading")
        const price = await getTokenPrice(pointer.coingeckoId);
        isMounted.current && setToken(({ ...token, price }));
      } catch (error) {
        console.error(error);
      } finally {
        isMounted.current && setIsLoading(false);
      }
    };
    load();
  }, [token.index]);

  return [
    toTokenAmount(pointer, token),
    isLoading,
    setToken,
  ];
};

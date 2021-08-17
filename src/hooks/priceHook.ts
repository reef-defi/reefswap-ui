import { useEffect, useState } from "react";
import { getTokenPrice } from "../api/prices";
import { TokenWithAmount, toTokenAmount } from "../api/rpc/tokens";
import { useAppSelector } from "../store/hooks";
import { defaultTokenState } from "../store/internalStore";

export const priceHook = (tokenIndex: number): [TokenWithAmount, boolean, (value: TokenWithAmount) => void] => {
  const { tokens } = useAppSelector((state) => state.tokens);
  
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(defaultTokenState(tokenIndex));

  const pointer = tokens[token.index];

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const price = await getTokenPrice(pointer.coingeckoId);
        setToken(({...token, price}))
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    load()
  }, [token.index]);

  return [
    toTokenAmount(pointer, token),
    isLoading,
    setToken,
  ];
}
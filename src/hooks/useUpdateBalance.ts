import { useEffect } from 'react';
import { TokenWithAmount } from '../api/rpc/tokens';
import { useAppSelector } from '../store/hooks';

export const useUpdateBalance = (token: TokenWithAmount, setToken: (value: TokenWithAmount) => void): void => {
  const { tokens } = useAppSelector((state) => state.tokens);

  useEffect(() => {
    tokens
      .forEach((storeToken) => storeToken.address === token.address
      && setToken({ ...token, ...storeToken }));
  }, [tokens]);
};

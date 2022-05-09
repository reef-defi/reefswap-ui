import {
  createEmptyTokenWithAmount, rpc, ReefSigner, reefTokenWithAmount, Token, TokenWithAmount,
} from '@reef-defi/react-lib';
import { useEffect, useState } from 'react';

type State = 'Init' | 'Loading' | 'Success';

interface UseTokensFinder {
  address1?: string;
  address2?: string;
  signer?: ReefSigner;
  tokens?: Token[]
}

type UseTokensFinderOutput = [TokenWithAmount, TokenWithAmount, State];

interface FindToken {
  tokens: Token[];
  address?: string;
  signer?: ReefSigner;
  defaultAmountValue: TokenWithAmount;
}

// if address or token list or token in list or on rpc does not exist return default values
// else combine data with default amount values
// function also guarenties that the found token is not empty
const findToken = async ({
  signer, address, tokens: tokensCombined, defaultAmountValue = createEmptyTokenWithAmount(),
}: FindToken): Promise<TokenWithAmount> => {
  if (!address || !signer || !tokensCombined) {
    return defaultAmountValue;
  }

  const existingToken = tokensCombined
    .find(((token) => token.address.toLowerCase() === address.toLowerCase()));

  if (existingToken) {
    return { ...defaultAmountValue, ...existingToken, isEmpty: false };
  }

  const promisedToken = await rpc.loadToken(address, signer.signer);
  if (promisedToken) {
    return { ...defaultAmountValue, ...promisedToken, isEmpty: false };
  }

  return defaultAmountValue;
};

export const useTokensFinder = ({
  address1, address2, tokens, signer,
}: UseTokensFinder): UseTokensFinderOutput => {
  const [state, setState] = useState<State>('Init');
  const [token1, setToken1] = useState<TokenWithAmount>(reefTokenWithAmount());
  const [token2, setToken2] = useState<TokenWithAmount>(createEmptyTokenWithAmount());

  useEffect(() => {
    const reset = async (): Promise<void> => {
      if (!tokens || !signer || state !== 'Init') {
        return;
      }

      setState('Loading');
      await findToken({
        signer,
        tokens,
        address: address1,
        defaultAmountValue: reefTokenWithAmount(),
      })
        .then(setToken1)
        .catch((e) => console.error(`Token: ${address1} was not found`));

      await findToken({
        signer,
        tokens,
        address: address2,
        defaultAmountValue: createEmptyTokenWithAmount(),
      })
        .then(setToken2)
        .catch((e) => console.error(`Token: ${address2} was not found`));

      setState('Success');
    };
    reset();
  }, [address2, address1, tokens, signer]);

  return [token1, token2, state];
};

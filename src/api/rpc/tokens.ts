import { Signer } from '@reef-defi/evm-provider';
import { BigNumber } from 'ethers';
import {
  getContract, ReefNetwork,
} from './rpc';
import testnetTokens from '../../validated-tokens-testnet.json';
import mainnetTokens from '../../validated-tokens-mainnet.json';
import { TokenState } from '../../store/internalStore';
import { calculateAmount } from '../../utils/math';

interface ValidatedToken {
  name: string;
  address: string;
  iconUrl: string;
  coingeckoId?: string;
}

export interface Token extends ValidatedToken {
  balance: BigNumber;
  decimals: number;
}

export interface TokenWithAmount extends Token {
  amount: string;
  price: number;
  isEmpty: boolean;
}

export const createEmptyToken = (): Token => ({
  name: 'Select token',
  address: '',
  balance: BigNumber.from('0'),
  decimals: -1,
  iconUrl: '',
});

export const createEmptyTokenWithAmount = (): TokenWithAmount => ({
  ...createEmptyToken(),
  price: -1,
  amount: '',
  isEmpty: true,
});

export const toTokenAmount = (token: Token, state: TokenState): TokenWithAmount => ({
  ...token,
  ...state,
  isEmpty: false,
});

export const loadVerifiedERC20Tokens = async ({ name }: ReefNetwork): Promise<ValidatedToken[]> => {
  switch (name) {
    case 'testnet': return testnetTokens.tokens;
    case 'mainnet': return mainnetTokens.tokens;
    default: throw new Error('Chain URL does not exist!');
  }
};

export const retrieveTokenAddresses = (tokens: Token[]): string[] => tokens.map((token) => token.address);

export const loadToken = async (address: string, signer: Signer, iconUrl: string): Promise<Token> => {
  const token = await getContract(address, signer);

  const signerAddress = await signer.getAddress();
  const balance = await token.balanceOf(signerAddress);
  const symbol = await token.symbol();
  const decimals = await token.decimals();

  return {
    iconUrl,
    decimals,
    address: token.address,
    balance: balance.toString(),
    name: symbol,
  };
};

export const loadTokens = async (addresses: ValidatedToken[], signer: Signer): Promise<Token[]> => Promise.all(
  addresses.map((token) => loadToken(token.address, signer, token.iconUrl)),
);

export const approveTokenAmount = async (token: TokenWithAmount, routerAddress: string, signer: Signer): Promise<void> => {
  const contract = await getContract(token.address, signer);
  const bnAmount = calculateAmount(token);
  await contract.approve(routerAddress, bnAmount);
};

export const approveAmount = async (from: string, to: string, amount: string, signer: Signer): Promise<void> => {
  const contract = await getContract(from, signer);
  await contract.approve(to, amount);
};

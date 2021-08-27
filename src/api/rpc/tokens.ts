import { Signer } from '@reef-defi/evm-provider';
import {
  getContract, getReefswapRouter, ReefNetwork,
} from './rpc';
import testnetTokens from '../../validated-tokens-testnet.json';
import mainnetTokens from '../../validated-tokens-mainnet.json';
import { toGasLimitObj, TokenState } from '../../store/internalStore';
import { calculateAmount } from '../../utils/math';

interface ValidatedToken {
  name: string;
  address: string;
  iconUrl: string;
  coingeckoId: string;
}

export interface Token extends ValidatedToken {
  balance: string;
  decimals: number;
}

export interface TokenWithAmount extends Token {
  index: number;
  amount: string;
  price: number;
}

export const toTokenAmount = (token: Token, state: TokenState): TokenWithAmount => ({
  ...token,
  ...state,
});

export const loadVerifiedERC20Tokens = async ({ name }: ReefNetwork): Promise<ValidatedToken[]> => {
  switch (name) {
    case 'testnet': return testnetTokens.tokens;
    case 'mainnet': return mainnetTokens.tokens;
    default: throw new Error('Chain URL does not exist!');
  }
};

export const retrieveTokenAddresses = (tokens: Token[]): string[] => tokens.map((token) => token.address);

export const loadToken = async (address: string, signer: Signer, iconUrl: string, coingeckoId: string): Promise<Token> => {
  const token = await getContract(address, signer);

  const signerAddress = await signer.getAddress();
  const balance = await token.balanceOf(signerAddress);
  const symbol = await token.symbol();
  const decimals = await token.decimals();

  return {
    iconUrl,
    decimals,
    coingeckoId,
    address: token.address,
    balance: balance.toString(),
    name: symbol,
  };
};

export const loadTokens = async (addresses: ValidatedToken[], signer: Signer): Promise<Token[]> => {
  return Promise.all(
    addresses.map((token) => loadToken(token.address, signer, token.iconUrl, token.coingeckoId)),
  );
};

export const approveTokenAmount = async (token: TokenWithAmount, routerAddress: string, signer: Signer): Promise<void> => {
  const contract = await getContract(token.address, signer);
  const bnAmount = calculateAmount(token);

  await contract.approve(routerAddress, bnAmount);
};

export const swapTokens = async (sellToken: TokenWithAmount, buyToken: TokenWithAmount, signer: Signer, network: ReefNetwork, gasLimit: string): Promise<void> => {
  const signerAddress = await signer.getAddress();

  const buyAmount = calculateAmount(buyToken);
  const sellAmount = calculateAmount(sellToken);
  const reefswapRouter = getReefswapRouter(network, signer);

  await approveTokenAmount(sellToken, network.routerAddress, signer);
  await reefswapRouter.swapExactTokensForTokens(
    sellAmount,
    buyAmount,
    [sellToken.address, buyToken.address],
    signerAddress,
    10000000000,
    toGasLimitObj(gasLimit),
  );
};

export const addLiquidity = async (token1: TokenWithAmount, token2: TokenWithAmount, signer: Signer, network: ReefNetwork, gasLimit: string): Promise<void> => {
  await approveTokenAmount(token1, network.routerAddress, signer);
  await approveTokenAmount(token2, network.routerAddress, signer);

  const signerAddress = await signer.getAddress();
  const reefswapRouter = getReefswapRouter(network, signer);

  await reefswapRouter.addLiquidity(
    token1.address,
    token2.address,
    calculateAmount(token1),
    calculateAmount(token2),
    calculateAmount(token1, 5), // min amount token1
    calculateAmount(token2, 5), // min amount token2
    signerAddress,
    10000000000,
    toGasLimitObj(gasLimit),
  );
};

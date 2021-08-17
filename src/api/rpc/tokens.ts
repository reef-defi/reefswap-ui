import { Signer } from '@reef-defi/evm-provider';
import {
  getContract, getReefswapRouter, ReefChains,
} from './rpc';
import testnetTokens from './../../validated-tokens-testnet.json';
import mainnetTokens from './../../validated-tokens-mainnet.json';
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
  ...state
});

export const loadVerifiedERC20Tokens = async (chainUrl: string): Promise<ValidatedToken[]> => {
  if (chainUrl === ReefChains.Testnet) {
    return testnetTokens.tokens;
  } if (chainUrl === ReefChains.Mainnet) {
    return mainnetTokens.tokens;
  }
  throw new Error('Chain URL does not exist!');
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
  const tokens = Promise.all(
    addresses.map((token) => loadToken(token.address, signer, token.iconUrl, token.coingeckoId)),
  );
  return tokens;
};

export const approveTokenAmount = async (token: TokenWithAmount, signer: Signer): Promise<void> => {
  const { address } = token;
  const reefswapContrctAddress = getReefswapRouter(signer).address;
  const contract = await getContract(address, signer);
  const bnAmount = calculateAmount(token);

  await contract.approve(reefswapContrctAddress, bnAmount);
};

export const swapTokens = async (sellToken: TokenWithAmount, buyToken: TokenWithAmount, signer: Signer, gasLimit: string): Promise<void> => {
  const signerAddress = await signer.getAddress();

  const buyAmount = calculateAmount(buyToken);
  const sellAmount = calculateAmount(sellToken);
  const reefswapRouter = getReefswapRouter(signer);

  await approveTokenAmount(sellToken, signer);
  await reefswapRouter.swapExactTokensForTokens(
    sellAmount,
    buyAmount,
    [sellToken.address, buyToken.address],
    signerAddress,
    10000000000,
    toGasLimitObj(gasLimit),
  );
};

export const addLiquidity = async (token1: TokenWithAmount, token2: TokenWithAmount, signer: Signer, gasLimit: string): Promise<void> => {
  await approveTokenAmount(token1, signer);
  await approveTokenAmount(token2, signer);

  const signerAddress = await signer.getAddress();
  const reefswapRouter = getReefswapRouter(signer);

  await reefswapRouter.addLiquidity(
    token1.address,
    token2.address,
    calculateAmount(token1),
    calculateAmount(token2),
    // TODO repare min and max amount values!
    0,
    0,
    signerAddress,
    10000000000,
    toGasLimitObj(gasLimit),
  );
};

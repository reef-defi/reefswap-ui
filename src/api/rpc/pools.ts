import { Signer } from '@reef-defi/evm-provider';
import { Contract, BigNumber } from 'ethers';
import {
  balanceOf, getReefswapFactory, getReefswapRouter, ReefNetwork,
} from './rpc';
import { approveTokenAmount, Token, TokenWithAmount } from './tokens';
import { ReefswapPair } from '../../assets/abi/ReefswapPair';
import { toGasLimitObj } from '../../store/internalStore';
import { ensure, uniqueCombinations } from '../../utils/utils';
import { calculateAmount, convert2Normal } from '../../utils/math';

const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';

export interface ReefswapPool {
  token1: Token;
  token2: Token;
  decimals: number;
  reserve1: string;
  reserve2: string;
  totalSupply: string;
  poolAddress: string;
  userPoolBalance: string;
  minimumLiquidity: string;
}

const findPoolTokenAddress = async (address1: string, address2: string, signer: Signer, network: ReefNetwork): Promise<string> => {
  const reefswapFactory = getReefswapFactory(network, signer);
  const address = await reefswapFactory.getPair(address1, address2);
  return address;
};

export const poolContract = async (token1: Token, token2: Token, signer: Signer, network: ReefNetwork): Promise<ReefswapPool> => {
  const address = await findPoolTokenAddress(token1.address, token2.address, signer, network);
  ensure(address !== EMPTY_ADDRESS, 'Pool does not exist!');
  const contract = new Contract(address, ReefswapPair, signer);

  const decimals = await contract.decimals();
  const reserves = await contract.getReserves();
  const totalSupply = await contract.totalSupply();
  const minimumLiquidity = await contract.MINIMUM_LIQUIDITY();
  const liquidity = await contract.balanceOf(await signer.getAddress());

  const address1 = await contract.token1();

  const tokenBalance1 = await balanceOf(token1.address, address, signer);
  const tokenBalance2 = await balanceOf(token2.address, address, signer);

  const [finalToken1, finalToken2] = token1.address === address1
    ? [{ ...token1, balance: tokenBalance1 }, { ...token2, balance: tokenBalance2 }]
    : [{ ...token2, balance: tokenBalance2 }, { ...token1, balance: tokenBalance1 }];

  const [finalReserve1, finalReserve2] = token1.address === address1
    ? [reserves[0], reserves[1]]
    : [reserves[1], reserves[0]];

  return {
    poolAddress: address,
    decimals: parseInt(decimals, 10),
    reserve1: finalReserve1.toString(),
    reserve2: finalReserve2.toString(),
    totalSupply: totalSupply.toString(),
    userPoolBalance: liquidity.toString(),
    minimumLiquidity: minimumLiquidity.toString(),
    token1: finalToken1,
    token2: finalToken2,
  };
};

export const loadPools = async (tokens: Token[], signer: Signer, network: ReefNetwork): Promise<ReefswapPool[]> => {
  const tokenCombinations = uniqueCombinations(tokens);
  const pools: ReefswapPool[] = [];
  for (let index = 0; index < tokenCombinations.length; index += 1) {
    try {
      const [token1, token2] = tokenCombinations[index];
      /* eslint-disable no-await-in-loop */
      const pool = await poolContract(token1, token2, signer, network);
      pools.push(pool);
    } catch (e) { }
  }
  return pools;
};

const createPoolToken = (address: string, amount: string): TokenWithAmount => ({
  address,
  amount,
  decimals: 18,
  balance: BigNumber.from('0'),
  name: 'ReefswapERC20',
  iconUrl: '',
  price: -1,
  isEmpty: true,
});

export const removeLiquidity = async ({
  token1, token2, userPoolBalance: liquidity, poolAddress,
}: ReefswapPool, signer: Signer, gasLimit: string, network: ReefNetwork): Promise<void> => {
  const reefswapRouter = getReefswapRouter(network, signer);
  const signerAddress = await signer.getAddress();

  const pairToken = createPoolToken(poolAddress, liquidity);
  await approveTokenAmount(pairToken, network.routerAddress, signer);

  await reefswapRouter.removeLiquidity(
    token1.address,
    token2.address,
    liquidity,
    calculateAmount({ ...token1, amount: token1.balance.toString() }),
    calculateAmount({ ...token2, amount: token2.balance.toString() }),
    signerAddress,
    10000000000,
    toGasLimitObj(gasLimit),
  );
};

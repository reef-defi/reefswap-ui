import { Signer } from '@reef-defi/evm-provider';
import { Contract, BigNumber } from 'ethers';
import {
  balanceOf, getReefswapFactory, getReefswapRouter,
} from './api';
import { approveTokenAmount, Token, TokenWithAmount } from './tokens';
import { ensure, uniqueCombinations } from '../utils/utils';
import { ReefswapPair } from '../assets/abi/ReefswapPair';
import { toGasLimitObj } from '../store/internalStore';

const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';

export interface ReefswapPool {
  token1: Token;
  token2: Token;
  liquidity: string;
  contract: Contract;
  poolAddress: string;
}

const findPoolTokenAddress = async (token1: Token, token2: Token, signer: Signer): Promise<string> => {
  const reefswapFactory = getReefswapFactory(signer);
  const address = await reefswapFactory.getPair(token1.address, token2.address);
  return address;
};

const poolContract = async (token1: Token, token2: Token, signer: Signer): Promise<ReefswapPool> => {
  const address = await findPoolTokenAddress(token1, token2, signer);
  ensure(address !== EMPTY_ADDRESS, 'Pool does not exist!');
  const contract = new Contract(address, ReefswapPair, signer);
  const liquidity = await contract.balanceOf(await signer.getAddress());

  const tokenBalance1 = await balanceOf(token1.address, address, signer);
  const tokenBalance2 = await balanceOf(token2.address, address, signer);

  return {
    poolAddress: address,
    contract,
    token1: { ...token1, balance: tokenBalance1.toString() },
    token2: { ...token2, balance: tokenBalance2.toString() },
    liquidity: liquidity.toString(),
  };
};

const ensurePoolBalance = async (pool: ReefswapPool, signer: Signer): Promise<void> => {
  const signerAddress = await signer.getAddress();
  const amount = await pool.contract.balanceOf(signerAddress);
  const balance = BigNumber.from(amount.toString());
  ensure(balance.gt(BigNumber.from(0)), 'Signer not in pool!');
};

export const isSignerInPool = async (token1: Token, token2: Token, signer: Signer): Promise<boolean> => {
  try {
    const pool = await poolContract(token1, token2, signer);
    await ensurePoolBalance(pool, signer);
    return true;
  } catch (_) {
    return false;
  }
};

export const loadPools = async (tokens: Token[], signer: Signer): Promise<ReefswapPool[]> => {
  const tokenCombinations = uniqueCombinations(tokens);

  const pools: ReefswapPool[] = [];
  for (let index = 0; index < tokenCombinations.length; index += 1) {
    try {
      const [token1, token2] = tokenCombinations[index];
      /* eslint-disable no-await-in-loop */
      const pool = await poolContract(token1, token2, signer);
      /* eslint-disable no-await-in-loop */
      await ensurePoolBalance(pool, signer);
      pools.push(pool);
    } catch (e) {

    }
  }
  return pools;
};

const createPoolToken = (address: string, amount: string): TokenWithAmount => ({
  address,
  amount,
  decimals: 18,
  balance: '0',
  name: 'ReefswapERC20',
});

export const removeLiquidity = async ({
  token1, token2, liquidity, poolAddress,
}: ReefswapPool, signer: Signer, gasLimit: string): Promise<void> => {
  const reefswapRouter = getReefswapRouter(signer);
  const signerAddress = await signer.getAddress();

  const pairToken = createPoolToken(poolAddress, liquidity);

  await approveTokenAmount(pairToken, signer);

  await reefswapRouter.removeLiquidity(
    token1.address,
    token2.address,
    liquidity,
    0, // TODO set the amount wiht fee calculateBalance(calculateFee(token1, 0.999999999)),
    0, // TODO same as above
    signerAddress,
    10000000000,
    toGasLimitObj(gasLimit),
  );
};

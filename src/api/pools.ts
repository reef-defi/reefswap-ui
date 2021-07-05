import { Signer } from "@reef-defi/evm-provider";
import { getReefswapFactory } from "./api";
import { Token, TokenWithAmount } from "./tokens";
import { Contract } from "ethers";
import { ReefswapERC20 } from "../assets/abi/ReefswapERC20";
import BN from "bn.js";
import { ensure } from "../utils/utils";

const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";

interface ReefswapPoolBase {
  address: string;
  token1: TokenWithAmount;
  token2: TokenWithAmount;
}


export interface ReefswapPool extends ReefswapPoolBase {
  signerBalance: BN;
  contract: Contract;
}

const uniqueCombinations = <T,>(array: T[]): [T, T][] => {
  let result: [T, T][] = [];
  for (let i = 0; i < array.length; i ++) {
    for (let j = i + 1; j < array.length; j ++) {
      result.push([array[i], array[j]])
    }
  }
  return result;
}


const tokensToPairAddresses = async (tokenCombinations: [Token, Token][], signer: Signer): Promise<ReefswapPoolBase[]> => {
  const reefswapFactory = getReefswapFactory(signer);
  return Promise.all(
    tokenCombinations
      .map(async ([token1, token2]): Promise<ReefswapPoolBase> => ({
        token1: {...token1, amount: ""},
        token2: {...token2, amount: ""},
        address: await reefswapFactory.getPair(token1.address, token2.address),
      })
    )
  );
}

const poolContract = async (token1: Token, token2: Token, signer: Signer): Promise<ReefswapPool> => {
  const [subPool] = await tokensToPairAddresses([[token1, token2]], signer);
  ensure(subPool.address !== EMPTY_ADDRESS, "Pool does not exist!");
  const contract = new Contract(subPool.address, ReefswapERC20, signer);
  const amount = await contract.balanceOf(await signer.getAddress());
  const signerBalance = new BN(amount.toString());
  return {...subPool, contract, signerBalance}
}

const ensurePoolBalance = async (pool: ReefswapPool, signer: Signer): Promise<void> => {
  const signerAddress = await signer.getAddress();
  const amount = await pool.contract.balanceOf(signerAddress);
  const balance = new BN(amount.toString());
  ensure(balance.gt(new BN("0")), "Signer not in pool!");
}

export const isSignerInPool = async (token1: Token, token2: Token, signer: Signer): Promise<boolean> => {
  try {
    const pool = await poolContract(token1, token2, signer);
    await ensurePoolBalance(pool, signer);
    return true;
  } catch (_) {
    return false;
  }
}

export const loadPools = async (tokens: Token[], signer: Signer): Promise<ReefswapPool[]> => {
  const tokenCombinations = uniqueCombinations(tokens);

  let pools: ReefswapPool[] = [];
  for (let index = 0; index < tokenCombinations.length; index ++) {
    try {
      const [token1, token2] = tokenCombinations[index];
      const pool = await poolContract(token1, token2, signer);
      await ensurePoolBalance(pool, signer);
      pools.push(pool);
    } catch (e) {
      continue;
    }
  }
  return pools;  
}


import { Signer } from "@reef-defi/evm-provider";
import { balanceOf, getContract, getReefswapFactory } from "./api";
import { Token } from "./tokens";
import { Contract } from "ethers";
import BN from "bn.js";
import { ensure, uniqueCombinations } from "../utils/utils";
import { ReefswapPair } from "../assets/abi/ReefswapPair";

const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";

interface ReefswapPoolBase {
  address: string;
  token1: Token;
  token2: Token;
}

export interface ReefswapPool extends ReefswapPoolBase {
  liquidity: string;
  contract: Contract;
}

const tokenPairAddress = async (token1: Token, token2: Token, signer: Signer): Promise<string> => {
  const reefswapFactory = getReefswapFactory(signer);
  const address = await reefswapFactory.getPair(token1.address, token2.address);
  return address;
}

const poolContract = async (token1: Token, token2: Token, signer: Signer): Promise<ReefswapPool> => {
  const address = await tokenPairAddress(token1, token2, signer);
  ensure(address !== EMPTY_ADDRESS, "Pool does not exist!");
  const contract = new Contract(address, ReefswapPair, signer);
  const liquidity = await contract.balanceOf(await signer.getAddress());

  const tokenBalance1 = await balanceOf(token1.address, address, signer);
  const tokenBalance2 = await balanceOf(token2.address, address, signer);

  return {
    address,
    contract, 
    token1: {...token1, balance: tokenBalance1.toString()},
    token2: {...token2, balance: tokenBalance2.toString()},
    liquidity: liquidity.toString()
  }
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


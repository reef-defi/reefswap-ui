import { Signer } from "@reef-defi/evm-provider";
import { getReefswapFactory } from "./api";
import { Token, TokenWithAmount } from "./tokens";
import { Contract } from "ethers";
import { ReefswapERC20 } from "../assets/abi/ReefswapERC20";
import BN from "bn.js";

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


const tokensToPairAddresses = async (tokenCombinations: [Token, Token][], reefswapFactory: Contract): Promise<ReefswapPoolBase[]> => 
  Promise.all(
    tokenCombinations
      .map(async ([token1, token2]): Promise<ReefswapPoolBase> => ({
        token1: {...token1, amount: ""},
        token2: {...token2, amount: ""},
        address: await reefswapFactory.getPair(token1.address, token2.address),
      })
    )
  );

export const loadPools = async (tokens: Token[], signer: Signer): Promise<ReefswapPool[]> => {
  const tokenCombinations = uniqueCombinations(tokens);
  const reefswapFactory = getReefswapFactory(signer);

  const signerAddress = await signer.getAddress();
  const allReefswapPoolContracts = await tokensToPairAddresses(tokenCombinations, reefswapFactory);

  const pools: ReefswapPool[] = await Promise.all(
    allReefswapPoolContracts
      .filter((contract) =>
        contract.address !== "0x0000000000000000000000000000000000000000")
      .map((pool) =>
        ({...pool, contract: new Contract(pool.address, ReefswapERC20, signer) }))
      .map(async (pool) =>
        ({...pool, signerBalance: new BN((await pool.contract.balanceOf(signerAddress)).toString())}))
  );

  const existingPools = pools
    .filter((pool) => pool.signerBalance.gt(new BN(0)))
  return existingPools;  
}


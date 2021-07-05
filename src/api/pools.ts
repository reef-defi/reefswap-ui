import { Signer } from "@reef-defi/evm-provider";
import { Token } from "./tokens";

export interface ReefswapPool {

}

export const loadPools = async (token: Token, signer: Signer): Promise<ReefswapPool[]> => {
  return [];
}
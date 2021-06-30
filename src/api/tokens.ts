import { Signer } from "@reef-defi/evm-provider";
import { getContract } from "./api";

export interface Token {
  address: string;
  balance: string;
  name: string;
  decimals: number;
}

export const defaultTokenAddresses = [
  "0x0000000000000000000000000000000001000000", // Reef
  "0x0000000000000000000000000000000001000001", // RUSD
]

// TODO add api call on reef explore
const loadVerifiedERC20TokenAddresses = async (): Promise<string[]> => 
  Promise.resolve([...defaultTokenAddresses]);

const loadToken = async (address: string, signer: Signer): Promise<Token> => {
  const signerAddress = await signer.getAddress();
  const contract = await getContract(address, signer);
  const balance = await contract.balanceOf(signerAddress);
  const decimals = await contract.decimals();
  const symbol = await contract.symbol();

  return {
    decimals,
    name: symbol,
    address: contract.address,
    balance: balance.toString(),
  }
}

export const loadTokens = async (addresses: string[], signer: Signer): Promise<Token[]> => {
  const tokens = Promise.all(
    addresses.map((address) => 
      loadToken(address, signer)
    )
  );
  return tokens;
}
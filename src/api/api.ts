import { Signer, Provider } from "@reef-defi/evm-provider";
import { Contract } from "ethers";
import { Token } from "../store/actions/tokens";
import { ERC20 } from "./abi/ERC20";
import ReefswapFactory from "./abi/ReefswapFactory";

export const checkIfERC20ContractExist = async (address: string, signer: Signer) => {
  try {
    const contract = new Contract(address, ERC20, signer);

    // TODO add additional checkers to be surtent of Contract existance
    await contract.name();
    await contract.symbol();
  } catch (error) {
    throw new Error("Contract does not exist or it is not in ERC20 form!");
  }
};

export const getContract = async (address: string, signer: Signer): Promise<Contract> => {
  await checkIfERC20ContractExist(address, signer);
  return new Contract(address, ERC20, signer);
}

export const getReefswapFactory = (signer: Signer) => 
  new Contract("0x0A2906130B1EcBffbE1Edb63D5417002956dFd41", ReefswapFactory, signer);

export const loadToken = async (address: string, signer: Signer): Promise<Token> => {
  const token = await getContract(address, signer);
  
  const signerAddress = await signer.getAddress();
  const balance = await token.balanceOf(signerAddress);
  const symbol = await token.symbol();

  return {
    address: token.address,
    balance: balance.toString(),
    name: symbol
  }
}
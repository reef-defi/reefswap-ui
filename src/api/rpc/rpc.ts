import { Signer } from '@reef-defi/evm-provider';
import { Network, availableNetworks } from '@reef-defi/react-lib';
import { Contract, BigNumber } from 'ethers';
import { ERC20 } from '../../assets/abi/ERC20';
import ReefswapFactory from '../../assets/abi/ReefswapFactory';
import ReefswapRouter from '../../assets/abi/ReefswapRouter';

export type AvailableNetworks = 'mainnet' | 'testnet';
export interface ReefNetwork extends Network {
  // rpcUrl: string;
  // reefscanUrl: string;
  // routerAddress: string;
  // factoryAddress: string;
  // name: AvailableNetworks;
}
type ReefNetworks = Record<AvailableNetworks, ReefNetwork>;

export const reefNetworks: ReefNetworks = {
  testnet: availableNetworks.testnet,
  mainnet: availableNetworks.mainnet,
};

export const checkIfERC20ContractExist = async (address: string, signer: Signer): Promise<void> => {
  try {
    const contract = new Contract(address, ERC20, signer);

    // TODO add additional checkers to be surtent of Contract existance
    await contract.name();
    await contract.symbol();
    await contract.decimals();
  } catch (error) {
    console.error(error);
    throw new Error('Unknown address');
  }
};

export const getContract = async (address: string, signer: Signer): Promise<Contract> => {
  await checkIfERC20ContractExist(address, signer);
  return new Contract(address, ERC20, signer);
};

export const balanceOf = async (address: string, balanceAddress: string, signer: Signer): Promise<BigNumber> => {
  const contract = await getContract(address, signer);
  const balance = await contract.balanceOf(balanceAddress);
  return balance;
};

export const getReefswapRouter = (network: ReefNetwork, signer: Signer): Contract => new Contract(network.routerAddress, ReefswapRouter, signer);
export const getReefswapFactory = (network: ReefNetwork, signer: Signer): Contract => new Contract(network.factoryAddress, ReefswapFactory, signer);

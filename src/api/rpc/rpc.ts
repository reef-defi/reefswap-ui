import { Signer } from '@reef-defi/evm-provider';
import { Contract, BigNumber } from 'ethers';
import { ERC20 } from '../../assets/abi/ERC20';
import ReefswapFactory from '../../assets/abi/ReefswapFactory';
import ReefswapRouter from '../../assets/abi/ReefswapRouter';

export type AvailableNetworks = 'mainnet' | 'testnet';
export interface ReefNetwork {
  rpcUrl: string;
  reefscanUrl: string;
  routerAddress: string;
  factoryAddress: string;
  name: AvailableNetworks;
}
type ReefNetworks = Record<AvailableNetworks, ReefNetwork>;

export const reefNetworks: ReefNetworks = {
  testnet: {
    name: 'testnet',
    rpcUrl: 'wss://rpc-testnet.reefscan.com/ws',
    reefscanUrl: 'https://testnet.reefscan.com/',
    factoryAddress: '0xcA36bA38f2776184242d3652b17bA4A77842707e',
    routerAddress: '0x0A2906130B1EcBffbE1Edb63D5417002956dFd41',
  },
  mainnet: {
    name: 'mainnet',
    rpcUrl: 'wss://rpc.reefscan.com/ws',
    reefscanUrl: 'https://reefscan.com/',
    routerAddress: '0x641e34931C03751BFED14C4087bA395303bEd1A5',
    factoryAddress: '0x380a9033500154872813F6E1120a81ed6c0760a8',
  },
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

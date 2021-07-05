import { Signer } from '@reef-defi/evm-provider';
import { Contract } from 'ethers';
import { ERC20 } from '../assets/abi/ERC20';
import ReefswapFactory from '../assets/abi/ReefswapFactory';
import ReefswapRouter from '../assets/abi/ReefswapRouter';
import { Token } from './tokens';

export enum ReefChains {
  Testnet='wss://rpc-testnet.reefscan.com/ws',
  Mainnet='wss://rpc.reefscan.com/ws',
}

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

export const getReefswapRouter = (signer: Signer): Contract => 
  new Contract('0x0A2906130B1EcBffbE1Edb63D5417002956dFd41', ReefswapRouter, signer);

export const getReefswapFactory = (signer: Signer): Contract =>
  new Contract('0xcA36bA38f2776184242d3652b17bA4A77842707e', ReefswapFactory, signer);

export const loadToken = async (address: string, signer: Signer): Promise<Token> => {
  const token = await getContract(address, signer);

  const signerAddress = await signer.getAddress();
  const balance = await token.balanceOf(signerAddress);
  const symbol = await token.symbol();
  const decimals = await token.decimals();

  return {
    address: token.address,
    balance: balance.toString(),
    name: symbol,
    decimals,
  };
};

export const defaultGasLimit = (): {gasLimit: string;} => ({
  gasLimit: '300000000',
});

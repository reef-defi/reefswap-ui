import { Signer, Provider } from '@reef-defi/evm-provider';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import type { Signer as InjectedSigner } from '@polkadot/api/types';
import { ReefswapSigner } from '../../store/actions/accounts';
import { ensure } from '../../utils/utils';

export const accountToSigner = async (account: InjectedAccountWithMeta, provider: Provider, sign: InjectedSigner): Promise<ReefswapSigner> => {
  const signer = new Signer(provider, account.address, sign);
  const evmAddress = await signer.getAddress();
  const isEvmClaimed = await signer.isClaimed();

  return {
    signer,
    evmAddress,
    isEvmClaimed,
    name: account.meta.name || '',
    address: account.address,
  };
};

export const accountsToSigners = async (accounts: InjectedAccountWithMeta[], provider: Provider, sign: InjectedSigner): Promise<ReefswapSigner[]> => Promise.all(accounts.map((account) => accountToSigner(account, provider, sign)));

export const bindSigner = async (signer: Signer): Promise<void> => {
  const hasEvmAddress = await signer.isClaimed();
  ensure(!hasEvmAddress, 'Account already has EVM address!');
  await signer.claimDefaultAccount();
};

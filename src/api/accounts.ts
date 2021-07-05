import { Signer, Provider } from '@reef-defi/evm-provider';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import type { Signer as InjectedSigner } from '@polkadot/api/types';
import { ReefswapSigner } from '../store/actions/accounts';
import { ensure } from '../utils/utils';

export const accountsToSigners = async (accounts: InjectedAccountWithMeta[], provider: Provider, sign: InjectedSigner): Promise<ReefswapSigner[]> => 
  Promise.all(
    accounts
      .map((account) => ({
        signer: new Signer(provider, account.address, sign),
        name: account.meta.name || '',
      }))
      .map(async (signer): Promise<ReefswapSigner> => ({
        ...signer,
        address: await signer.signer.getAddress(),
        isEvmClaimed: await signer.signer.isClaimed(),
      })),
  );

export const bindSigner = async (signer: Signer): Promise<void> => {
  const hasEvmAddress = await signer.isClaimed();
  ensure(!hasEvmAddress, 'Account already has EVM address!');
  await signer.claimDefaultAccount();
};

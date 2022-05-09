import { Signer } from '@reef-defi/evm-provider';
import { ensure } from '../../utils/utils';

export const bindSigner = async (signer: Signer): Promise<void> => {
  const hasEvmAddress = await signer.isClaimed();
  ensure(!hasEvmAddress, 'Account already has EVM address!');
  await signer.claimDefaultAccount();
};

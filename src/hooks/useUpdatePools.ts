import { loadPools } from '../api/rpc/pools';
import { loadingPools, setPools } from '../store/actions/pools';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useAsyncEffect } from './useAsyncEffect';

export const useUpdatePools = (): void => {
  const dispatch = useAppDispatch();
  const { tokens } = useAppSelector((state) => state.tokens);
  const settings = useAppSelector((state) => state.settings);
  const { accounts, selectedAccount } = useAppSelector((state) => state.accounts);

  useAsyncEffect(async () => {
    if (selectedAccount === -1) { return; }
    const { signer } = accounts[selectedAccount];
    
    await Promise.resolve()
      .then(() => dispatch(loadingPools()))
      .then(() => loadPools(tokens, signer, settings))
      .then((res) => dispatch(setPools(res)))
      .catch(() => dispatch(setPools([])));
  // TODO even tho we would not need selectedAccount dependenci, cause tokens are dependent on it, we need it to fix loading between networks. Debug why is that so?
  }, [tokens, selectedAccount]);
};

import { Provider } from '@reef-defi/evm-provider';
import { useEffect } from 'react';
import { accountsSetAccountBalance } from '../store/actions/accounts';
import { useAppDispatch, useAppSelector } from '../store/hooks';

// This hook is used to retrieve account reef balance even if the account address was not claimed
export const useUpdateAccountBalance = (provider?: Provider): void => {
  const dispatch = useAppDispatch();
  const { accounts, selectedAccount } = useAppSelector((state) => state.accounts);

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        if (selectedAccount === -1 || !provider) { return; }
        const { address } = accounts[selectedAccount];
        const providerBalance = await provider.api.derive.balances.all(address);
        const freeBalance = providerBalance.freeBalance.toHuman();
        const result = freeBalance === '0' ? '0 REEF' : freeBalance;

        dispatch(accountsSetAccountBalance(result));
      } catch (error) {}
    };

    const interval = setInterval(() => load(), 1000);
    return () => clearInterval(interval);
  }, [provider, selectedAccount]);
};

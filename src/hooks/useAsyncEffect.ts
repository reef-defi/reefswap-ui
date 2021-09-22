import { useEffect } from 'react';

export const useAsyncEffect = (fun: () => Promise<void>, reference: React.DependencyList = []): void => {
  useEffect(() => {
    fun();
  }, [...reference]);
};

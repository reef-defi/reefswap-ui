import { useEffect, useRef, useState } from 'react';
import { retrieveReefCoingeckoPrice } from '../api/prices';

type ReefPriceOutput = [number, boolean]

export const useReefPrice = (): ReefPriceOutput => {
  const mounted = useRef(true);
  const [price, setPrice] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async (): Promise<void> => {
      mounted.current = true;
      Promise.resolve()
        .then(() => setIsLoading(true))
        .then(() => retrieveReefCoingeckoPrice())
        .then((res) => {
          if (mounted.current) {
            setPrice(res);
          }
        })
        .catch(() => setPrice(0)) // TODO try maybe nan?
        .finally(() => setIsLoading(false));
    };

    load();

    return () => {
      mounted.current = false;
    };
  }, []);

  return [price, isLoading];
};

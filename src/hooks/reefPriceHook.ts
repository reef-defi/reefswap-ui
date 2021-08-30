import React, { useEffect, useRef, useState } from "react";
import { retrieveReefCoingeckoPrice } from "../api/prices";

type ReefPriceOutput = [number, boolean]

export const reefPriceHook = (): ReefPriceOutput => {
  const mounted = useRef(true);
  const [price, setPrice] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      Promise.resolve()
        .then(() => setIsLoading(true))
        .then(() => retrieveReefCoingeckoPrice())
        .then(setPrice)
        .catch(() => setPrice(0)) // TODO try maybe nan?
        .finally(() => setIsLoading(false));
    };

    load();
    
    return () => {
      mounted.current = false;
    }
  }, []);

  return [price, isLoading];
};
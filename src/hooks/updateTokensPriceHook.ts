import { settings } from "cluster";
import { useEffect, useRef, useState } from "react";
import { retrieveReefCoingeckoPrice } from "../api/prices";
import { poolContract, ReefswapPool } from "../api/rpc/pools";
import { TokenWithAmount } from "../api/rpc/tokens";
import { useAppSelector } from "../store/hooks";
import { convertAmount, poolRatio } from "../utils/math";
import { ensureVoidRun } from "../utils/utils";

interface UpdateTokensPriceHook {
  pool?: ReefswapPool;
  token1: TokenWithAmount;
  token2: TokenWithAmount;
  setToken1: (token: TokenWithAmount) => void;
  setToken2: (token: TokenWithAmount) => void;
}

export const UpdateTokensPriceHook = ({pool, token1, token2, setToken1, setToken2}: UpdateTokensPriceHook) => {
  const settings = useAppSelector((state) => state.settings);
  const {tokens} = useAppSelector((state) => state.tokens);
  const {accounts, selectedAccount} = useAppSelector((state) => state.accounts);
  
  const mounted = useRef(true);
  const [prevAddress1, setPrevAddress1] = useState(token1.address);
  const [prevAddress2, setPrevAddress2] = useState(token2.address);
  
  const {signer} = accounts[selectedAccount];
  const ensureMount = ensureVoidRun(mounted.current);

  const updateTokens = (tokenPrice1: number, tokenPrice2: number): void => {
    const updatedAmo1 = convertAmount(token2.amount, tokenPrice1, tokenPrice2);
    const updatedAmo2 = convertAmount(token1.amount, tokenPrice2, tokenPrice1);
    ensureMount(setToken1, {
      ...token1,
      price: tokenPrice1,
      amount: token1.address !== prevAddress1 ? updatedAmo1 !== 0 
        ? updatedAmo1.toFixed(4) : "" : token1.amount,
    });
    ensureMount(setToken2, {
      ...token2,
      price: tokenPrice2,
      amount: token2.address !== prevAddress2 ? updatedAmo2 !== 0
        ? updatedAmo2.toFixed(4) : "" : token2.amount,
    });
  };

  useEffect(() => {
    const load = async () => {
      if (!pool || (prevAddress1 === token2.address && prevAddress2 === token1.address)) { return; }
      try {
        const reefPrice = await retrieveReefCoingeckoPrice();
        const baseRatio = poolRatio(pool);

        if (token1.name === 'REEF') {
          updateTokens(reefPrice, reefPrice / baseRatio);
        } else if (token2.name === 'REEF') {
          updateTokens(reefPrice * baseRatio, reefPrice);
        } else {
          const sellPool = await poolContract(tokens[0], token1, signer, settings);
          const sellRatio = poolRatio(sellPool);
          updateTokens(reefPrice / sellRatio, reefPrice / sellRatio * baseRatio);
        }
      } catch (error) {
        updateTokens(0, 0);
      } finally {
        setPrevAddress1(token1.address);
        setPrevAddress2(token2.address);
      }
    };
    load();
  }, [pool]);
};
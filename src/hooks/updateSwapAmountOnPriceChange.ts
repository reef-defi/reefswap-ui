import { useRef, useState, useEffect } from "react";
import { ReefswapPool } from "../api/rpc/pools";
import { TokenWithAmount } from "../api/rpc/tokens";
import { getInputAmount, getOutputAmount } from "../utils/math";

interface UpdateSwapAmountOnPriceChangeInput {
  pool?: ReefswapPool;
  buy: TokenWithAmount;
  sell: TokenWithAmount;
  setBuy: (value: TokenWithAmount) => void;
  setSell: (value: TokenWithAmount) => void;
}

export const UpdateSwapAmountOnPriceChange = ({pool, buy, sell, setSell, setBuy}: UpdateSwapAmountOnPriceChangeInput) => {
  const [prevBuyAddress, setPrevBuyAddress] = useState(buy.address);
  const [prevSellAddress, setPrevSellAddress] = useState(sell.address);

  useEffect(() => {
    if (!pool || buy.price === 0 || sell.price === 0) { return; }

    if (buy.address !== prevBuyAddress) {
      setBuy({...buy, amount: getOutputAmount(sell, pool).toFixed(4)})
    } else if (sell.address !== prevSellAddress) {
      setSell({...sell, amount: getInputAmount(buy, pool).toFixed(4)})
    }

    setPrevBuyAddress(buy.address);
    setPrevSellAddress(sell.address);
  }, [buy.price, sell.price])
};
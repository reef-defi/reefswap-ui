import React from "react";
import { Components } from "@reef-defi/react-lib";
import { useHistory, useParams } from "react-router-dom";
import {
  addressReplacer,
  ADD_LIQUIDITY_URL,
  REMOVE_LIQUIDITY_URL,
  SWAP_URL,
} from "../../utils/urls";
import { useAppSelector } from "../../store/hooks";
import { getIconUrl } from "../../utils/utils";

const { PoolPage } = Components;

interface UrlParam {
  address: string;
}

const Pool = (): JSX.Element => {
  const history = useHistory();
  const { address } = useParams<UrlParam>();
  const network = useAppSelector((state) => state.settings);

  const openTrade = (address1: string, address2: string): void =>
    history.push(addressReplacer(SWAP_URL, address1, address2));
  const openAddLiquidity = (address1: string, address2: string): void =>
    history.push(addressReplacer(ADD_LIQUIDITY_URL, address1, address2));
  const openRemoveLiquidity = (address1: string, address2: string): void =>
    history.push(addressReplacer(REMOVE_LIQUIDITY_URL, address1, address2));

  return (
    <PoolPage
      address={address}
      reefscanFrontendUrl={network.reefscanFrontendUrl}
      openTrade={openTrade}
      getIconUrl={getIconUrl}
      openAddLiquidity={openAddLiquidity}
      openRemoveLiquidity={openRemoveLiquidity}
    />
  );
};

export default Pool;

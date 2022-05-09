import { utils } from "@reef-defi/react-lib";


export interface UrlAddressParams {
  address1: string;
  address2: string;
}

export const addressReplacer = (url: string, address1: string, address2: string): string => url
  .replace(':address1', address1)
  .replace(':address2', address2);


export const BIND_URL = '/bind';
export const POOLS_URL = `/pools`;
export const SWAP_URL = '/swap/:address1/:address2';
export const POOL_URL = `/pool/:address`;
export const IMPORT_POOL_URL = `/import`;
export const ADD_LIQUIDITY_URL = `/supply/:address1/:address2`;
export const REMOVE_LIQUIDITY_URL = `/remove/:address1/:address2`;

export const INITIALIZED_URLS = [BIND_URL, SWAP_URL, ADD_LIQUIDITY_URL, REMOVE_LIQUIDITY_URL, POOLS_URL, POOL_URL];

export const SETTINGS_URL = '/settings';

export const defaultSwapUrl = addressReplacer(SWAP_URL, utils.REEF_ADDRESS, utils.EMPTY_ADDRESS);
export const defaultAddliquidityUrl = addressReplacer(ADD_LIQUIDITY_URL, utils.REEF_ADDRESS, utils.EMPTY_ADDRESS);

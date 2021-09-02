export const BIND_URL = '/bind';
export const POOL_URL = '/pool';
export const SWAP_URL = '/swap';
export const IMPORT_POOL_URL = `${POOL_URL}/import`;
export const ADD_LIQUIDITY_URL = `${POOL_URL}/supply`;
export const REMOVE_LIQUIDITY_URL = `${POOL_URL}/remove/:address1/:address2`;

export const INITIALIZED_URLS = [BIND_URL, POOL_URL, SWAP_URL, IMPORT_POOL_URL, ADD_LIQUIDITY_URL];

export const SETTINGS_URL = '/settings';

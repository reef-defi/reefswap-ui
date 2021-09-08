import { ReefswapPool } from '../../api/rpc/pools';
import { ADD_POOL, LOADING_POOLS, SET_POOLS } from '../actionCreator';

interface SetPoolsAction {
  type: typeof SET_POOLS;
  pools: ReefswapPool[];
}

interface AddPoolAction {
  type: typeof ADD_POOL;
  pool: ReefswapPool;
}

interface LoadingPoolsAction {
  type: typeof LOADING_POOLS;
}

export type PoolsActions =
  | AddPoolAction
  | SetPoolsAction
  | LoadingPoolsAction;

export const setPools = (pools: ReefswapPool[]): SetPoolsAction => ({
  type: SET_POOLS,
  pools,
});

export const addPool = (pool: ReefswapPool): AddPoolAction => ({
  type: ADD_POOL,
  pool,
});

export const loadingPools = (): LoadingPoolsAction => ({
  type: LOADING_POOLS,
});

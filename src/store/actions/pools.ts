import { ReefswapPool } from "../../api/pools";
import { ADD_POOL, RELOAD_POOL, SET_POOLS } from "../actionCreator";

interface SetPoolsAction {
  type: typeof SET_POOLS;
  pools: ReefswapPool[];
}

interface AddPoolAction {
  type: typeof ADD_POOL;
  pool: ReefswapPool;
}

interface ReloadPoolAction {
  type: typeof RELOAD_POOL;
}

export type PoolsActions =
  | SetPoolsAction
  | ReloadPoolAction
  | AddPoolAction;

export const setPools = (pools: ReefswapPool[]): SetPoolsAction => ({
  type: SET_POOLS,
  pools
});

export const addPool = (pool: ReefswapPool): AddPoolAction => ({
  type: ADD_POOL,
  pool
});

export const reloadPool = (): ReloadPoolAction => ({
  type: RELOAD_POOL
});
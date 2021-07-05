import { ReefswapPool } from "../../api/pools";
import { ADD_POOL, SET_POOLS } from "../actionCreator";

interface SetPoolsAction {
  type: typeof SET_POOLS;
  pools: ReefswapPool[];
}

interface AddPoolAction {
  type: typeof ADD_POOL;
  pool: ReefswapPool;
}

export type PoolsActions =
  | SetPoolsAction
  | AddPoolAction;

export const setPools = (pools: ReefswapPool[]): SetPoolsAction => ({
  type: SET_POOLS,
  pools
});

export const addPool = (pool: ReefswapPool): AddPoolAction => ({
  type: ADD_POOL,
  pool
});
import { ReefswapPool } from '../../api/pools';
import { ADD_POOL, RELOAD_POOL, SET_POOLS } from '../actionCreator';
import { PoolsActions } from '../actions/pools';

export interface PoolsReducer {
  pools: ReefswapPool[];
  reloadPool: boolean;
}

const defaultPoolsState: PoolsReducer = {
  pools: [],
  reloadPool: true,
};

export const poolsReducer = (state = defaultPoolsState, action: PoolsActions): PoolsReducer => {
  switch (action.type) {
    case SET_POOLS: return { ...state, pools: [...action.pools], reloadPool: false };
    case ADD_POOL: return { ...state, pools: [...state.pools, { ...action.pool }] };
    case RELOAD_POOL: return { ...state, reloadPool: true };
    default: return state;
  }
};

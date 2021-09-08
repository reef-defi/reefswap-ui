import { ReefswapPool } from '../../api/rpc/pools';
import { ADD_POOL, LOADING_POOLS, SET_POOLS } from '../actionCreator';
import { PoolsActions } from '../actions/pools';

export interface PoolsReducer {
  pools: ReefswapPool[];
  isLoading: boolean;
}

const defaultPoolsState: PoolsReducer = {
  pools: [],
  isLoading: false,
};

export const poolsReducer = (state = defaultPoolsState, action: PoolsActions): PoolsReducer => {
  switch (action.type) {
    case SET_POOLS: return { ...state, pools: [...action.pools], isLoading: false };
    case ADD_POOL: return { ...state, pools: [...state.pools, { ...action.pool }] };
    case LOADING_POOLS: return { ...state, isLoading: true };
    default: return state;
  }
};

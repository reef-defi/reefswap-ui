import { ReefswapPool } from "../../api/pools";
import { ADD_POOL, SET_POOLS } from "../actionCreator";
import { PoolsActions } from "../actions/pools";

export interface PoolsReducer {
  pools: ReefswapPool[];
}

const defaultPoolsState: PoolsReducer = {
  pools: [],
};

export const poolsReducer = (state=defaultPoolsState, action: PoolsActions): PoolsReducer => {
  switch (action.type) {
    case SET_POOLS: return {...state, pools: [...action.pools]};
    case ADD_POOL: return {...state, pools: [...state.pools, {...action.pool}]};
    default: return state;
  }
}
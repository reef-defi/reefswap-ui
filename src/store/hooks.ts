import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, ReducerState } from ".";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<ReducerState> = useSelector;
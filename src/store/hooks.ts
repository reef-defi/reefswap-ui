import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, ReducerState } from '.';

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<ReducerState> = useSelector;

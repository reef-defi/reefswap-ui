interface Message {
  message: string;
}

interface Content <Type> {
  content: Type;
}

export interface Settings {
  gasLimit: string;
  percentage: number;
  deadline: number;
}

// It is kind of lame we need to pass the type inside...
// TODO when new versions of typescript will come remove {_type}
// and ensure state type by ckechking it.
// IE. (state is InitialState) or something like it
export type PhantomState <Type, Data> = {_type: Type} & Data;

export type InitialState = PhantomState<'InitialState', unknown>;
export type LoadingState = PhantomState<'LoadingState', unknown>;
export type SuccessState = PhantomState<'SuccessState', unknown>;
export type ErrorState = PhantomState<'ErrorState', Message>;
export type LoadingMessageState = PhantomState<'LoadingMessageState', Message>;
export type SuccessContentState <Type> = PhantomState<'SuccessContentState', Content<Type>>;

// Default state transformation actions
export const toInit = (): InitialState => ({ _type: 'InitialState' });
export const toLoading = (): LoadingState => ({ _type: 'LoadingState' });
export const toSuccess = (): SuccessState => ({ _type: 'SuccessState' });
export const toError = (message: string): ErrorState => ({ message, _type: 'ErrorState' });
export const toLoadingMessage = (message: string): LoadingMessageState => ({ message, _type: 'LoadingMessageState' });
export const toSuccessContent = <T, > (content: T): SuccessContentState<T> => ({ content, _type: 'SuccessContentState' });

export interface TokenState {
  index: number;
  amount: string;
  price: number;
}

export const defaultTokenState = (index = 0): TokenState => ({
  index,
  amount: '',
  price: 0,
});

export const DEFAULT_SLIPPAGE_TOLERANCE = 0.8;
export const MAX_SLIPPAGE_TOLERANCE = DEFAULT_SLIPPAGE_TOLERANCE + 0.5;
export const DEFAULT_DEADLINE = 1;
export const DEFAULT_GAS_LIMIT = '300000000';

export const defaultSettings = (): Settings => ({
  gasLimit: DEFAULT_GAS_LIMIT,
  deadline: NaN,
  percentage: NaN,
});

export const resolveSettings = ({deadline, gasLimit, percentage}: Settings): Settings => ({
  deadline: isNaN(deadline) ? DEFAULT_DEADLINE : deadline,
  gasLimit: gasLimit === '' ? DEFAULT_GAS_LIMIT : gasLimit,
  percentage: isNaN(percentage) ? DEFAULT_SLIPPAGE_TOLERANCE : percentage
});

export const toGasLimitObj = (gasLimit: string): {gasLimit: string} => ({
  gasLimit,
});

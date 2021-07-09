interface Message {
  message: string;
}

interface Content <Type> {
  content: Type;
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

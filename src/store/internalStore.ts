// Known actions
export const ERROR_STATE = "ERROR_STATE";
export const INITIAL_STATE = "INITIAL_STATE";
export const LOADING_STATE = "LOADING_STATE";
export const SUCCESS_STATE = "SUCCESS_STATE";
export const LOADING_MESSAGE_STATE = "LOADING_MESSAGE_STATE";
export const SUCCESS_CONTENT_STATE = "SUCCESS_WITH_CONTENT";

// Internal action interfaces
export interface InitialState {
  type: typeof INITIAL_STATE;
};

export interface LoadingState {
  type: typeof LOADING_STATE;
};

export interface LoadingContentState {
  type: typeof LOADING_MESSAGE_STATE;
  message: string;
}

export interface SuccessState {
  type: typeof SUCCESS_STATE;
};

export interface SuccessContentState <T, > {
  type: typeof SUCCESS_CONTENT_STATE,
  content: T
};

export interface ErrorState {
  type: typeof ERROR_STATE;
  message: string;
};

// Default state transformation actions
export const toInit = (): InitialState => ({
  type: INITIAL_STATE,
})

export const toLoading = (): LoadingState => ({
  type: LOADING_STATE,
})

export const toLoadingMessage = (message: string): LoadingContentState => ({
  type: LOADING_MESSAGE_STATE,
  message
});

export const toSuccess = (): SuccessState => ({
  type: SUCCESS_STATE,
});

export const toSuccessContent = <T, > (content: T): SuccessContentState<T> => ({
  type: SUCCESS_CONTENT_STATE,
  content
});

export const toError = (message: string): ErrorState => ({
  type: ERROR_STATE,
  message
});
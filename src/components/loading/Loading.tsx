import React from 'react';

export const Loading = (): JSX.Element => (
  <div className="spinner-border text-secondary m-auto" role="status">
    <span className="visually-hidden">Loading...</span>
  </div>
);

export const LoadingButtonIcon = (): JSX.Element => (
  <div className="spinner-border spinner-border-sm text-white m-auto" role="status">
    <span className="visually-hidden">Loading...</span>
  </div>
);

interface LoadingWithText {
  text: string;
}

export const LoadingWithText = ({ text }: LoadingWithText): JSX.Element => (
  <div className="d-flex flex-column justify-content-center">
    <Loading />
    <span className="m-auto mt-2">{text}</span>
  </div>
);

export const LoadingComponent = ({ text }: LoadingWithText): JSX.Element => (
  <div className="container justify-content-center mt-4">
    <LoadingWithText text={text} />
  </div>
);

export const LoadingButtonIconWithText = ({ text }: LoadingWithText): JSX.Element => (
  <>
    <span className="m-auto mt-2 me-2">{text}</span>
    <div className="spinner-border spinner-border-sm text-white m-auto" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </>
);

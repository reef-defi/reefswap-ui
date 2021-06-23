import React from "react"

export const Loading = () =>  (
  <div className="spinner-border text-secondary m-auto" role="status">
    <span className="visually-hidden">Loading...</span>
  </div>
);

interface LoadingWithText {
  text: string;
}

export const LoadingWithText = ({text}: LoadingWithText) => (
  <div className="d-flex flex-column justify-content-center">
    <Loading />
    <span className="m-auto mt-2">{text}</span>
  </div>
);

export const LoadingComponent = ({text}: LoadingWithText) => (
  <div className="container justify-content-center mt-4">
    <LoadingWithText text={text} />
  </div>
)


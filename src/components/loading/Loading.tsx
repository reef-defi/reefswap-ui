import React from "react"

export const Loading = () =>  (
  <div className="spinner-border text-secondary" role="status">
    <span className="visually-hidden">Loading...</span>
  </div>
);

export const LoadingPolkadotExtension = () => (
  <div>
    <Loading />
    <span>Connecting to Polkadot extension...</span>
  </div>
);
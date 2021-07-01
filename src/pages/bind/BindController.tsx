import React from 'react';
import Card, { CardTitle } from '../../components/card/Card';

const BindController = (): JSX.Element => (
  <Card>
    <CardTitle title="Bind selected account" />
    <div className="alert alert-danger mt-2 border-rad" role="alert">
      <b>Tip: </b>
      Bind an EVM account to your Substrate account, so that you can use a single account for any transactions on the Reef
      chain.
      {' '}
      <a target="_blank" href="https://docs.reef.finance/docs/developers/accounts/#linking-an-existing-ethereum-address" rel="noreferrer">Read more.</a>
    </div>

    <button type="button" className="btn btn-reef w-100 border-rad mt-2">Bind</button>
    <button type="button" className="btn btn-reef w-100 border-rad mt-2" disabled>Selected account is binded</button>
  </Card>
);

export default BindController;

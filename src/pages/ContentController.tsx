import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import {
  ADD_LIQUIDITY_URL, BIND_URL, IMPORT_POOL_URL, POOL_URL, SWAP_URL,
} from '../utils/urls';
import BindController from './bind/BindController';
import AddLiquidity from './pool/AddLiquidity';
import ImportPool from './pool/ImportPool';
import PoolContoller from './pool/PoolContoller';
import SwapController from './swap/SwapController';

const ContentController = (): JSX.Element => (
  <Switch>
    <Route exact path={BIND_URL} component={BindController} />
    <Route exact path={POOL_URL} component={PoolContoller} />
    <Route exact path={SWAP_URL} component={SwapController} />
    <Route exact path={IMPORT_POOL_URL} component={ImportPool} />
    <Route exact path={ADD_LIQUIDITY_URL} component={AddLiquidity} />
    <Route path="/" render={() => <Redirect to={POOL_URL} />} />
  </Switch>
);

export default ContentController;

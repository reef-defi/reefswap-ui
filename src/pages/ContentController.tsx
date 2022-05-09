import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import {
  ADD_LIQUIDITY_URL, BIND_URL, IMPORT_POOL_URL, REMOVE_LIQUIDITY_URL, SWAP_URL, POOL_URL, POOLS_URL, defaultSwapUrl,
} from '../utils/urls';
import BindController from './bind/BindController';
import AddLiquidity from './pool/AddLiquidity';
import ImportPool from './pool/ImportPool';
import Pool from './pool/Pool';
import Pools from './pool/Pools';
import RemoveLiquidity from './pool/RemoveLiquidity';
import SwapController from './swap/SwapController';

console.log(defaultSwapUrl);
const ContentController = (): JSX.Element => (
  <Switch>
    <Route exact path={BIND_URL} component={BindController} />
    <Route exact path={IMPORT_POOL_URL} component={ImportPool} />
    
    <Route exact path={POOLS_URL} component={Pools} />
    <Route path={POOL_URL} component={Pool} />
    <Route path={SWAP_URL} component={SwapController} />
    <Route path={ADD_LIQUIDITY_URL} component={AddLiquidity} />
    <Route path={REMOVE_LIQUIDITY_URL} component={RemoveLiquidity} />
    <Route path="/" render={() => <Redirect to={defaultSwapUrl} />} />
  </Switch>
);

export default ContentController;

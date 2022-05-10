import { hooks } from '@reef-defi/react-lib';
import React, { useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { setAllTokensAction } from '../store/actions/tokens';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  ADD_LIQUIDITY_URL, BIND_URL, IMPORT_POOL_URL, REMOVE_LIQUIDITY_URL, SWAP_URL, POOL_URL, POOLS_URL, defaultSwapUrl, SETTINGS_URL,
} from '../utils/urls';
import BindController from './bind/BindController';
import AddLiquidity from './pool/AddLiquidity';
import ImportPool from './pool/ImportPool';
import Pool from './pool/Pool';
import Pools from './pool/Pools';
import RemoveLiquidity from './pool/RemoveLiquidity';
import Settings from './settings/Settings';
import SwapController from './swap/SwapController';

const ContentController = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const {accounts, selectedAccount} = useAppSelector((state) => state.accounts);

  const signer = accounts[selectedAccount];
  const tokens = hooks.useAllTokens(signer?.address);

  useEffect(() => {
    dispatch(setAllTokensAction(tokens));
  }, [tokens]);

  return (
    <div className="container-fluid mt-4 w-100 d-flex justify-content-center">
      <Switch>
        <Route exact path={SETTINGS_URL} component={Settings} />
        <Route exact path={BIND_URL} component={BindController} />
        <Route exact path={IMPORT_POOL_URL} component={ImportPool} />
        <Route exact path={POOLS_URL} component={Pools} />
        
        <Route path={POOL_URL} component={Pool} />
        <Route path={SWAP_URL} component={SwapController} />
        <Route path={ADD_LIQUIDITY_URL} component={AddLiquidity} />
        <Route path={REMOVE_LIQUIDITY_URL} component={RemoveLiquidity} />
        <Route path="/" render={() => <Redirect to={defaultSwapUrl}/>} />
      </Switch>
    </div>
  );
}

export default ContentController;

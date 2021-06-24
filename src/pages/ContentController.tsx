import React from "react"
import { Redirect, Route, Switch } from "react-router-dom";
import { BIND_URL, POOL_URL, SWAP_URL } from "../urls";
import SwapController from "./swap/SwapController";

const ContentController = () => (
  <Switch>
    <Route exact path={SWAP_URL} component={SwapController} />
    <Route exact path={POOL_URL} render={() => <div>Pool</div>} />
    <Route exact path={BIND_URL} render={() => <div>Bind</div>} />
    <Route path="/" render={() => <Redirect to={SWAP_URL} />} />
  </Switch>
);

export default ContentController;
import React, { ReactElement } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import NavigationBar from './components/navigation/NavigationBar';
import Home from './screens/Home';
import Login from './screens/Login';
import MyAccount from './screens/MyAccount';
import MyPromotions from './screens/MyPromotions';
import UploadPromotion from './screens/UploadPromotion';

export default function Router(): ReactElement {
  const loggedIn = false;
  return (
    <>
      <BrowserRouter>
        <NavigationBar />

        <Switch>
          {/* Switches to "My Account" after login */}
          <Route path="/account">{loggedIn ? <MyAccount /> : <Login />}</Route>
          <Route path="/promotion" exact={true}>
            <MyPromotions />
          </Route>
          <Route path="/promotion/upload">
            <UploadPromotion />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
}

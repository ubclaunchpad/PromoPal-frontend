import React, { ReactElement } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import NavigationBar from './components/navigation/NavigationBar';
import Home from './screens/Home';
import { LocationSearchInput } from './screens/LocationSearchInput';
import MyAccount from './screens/MyAccount';
import MyPromotions from './screens/MyPromotions';

export default function Router(): ReactElement {
  return (
    <>
      <BrowserRouter>
        <NavigationBar />

        <Switch>
          {/* Switches to "My Promos" after login */}
          <Route path="/login">
            {/* <Login /> */}
            <MyPromotions />
          </Route>
          <Route path="/myaccount">
            <MyAccount />
          </Route>
          <Route path="/promotion/upload">
            <LocationSearchInput />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
}

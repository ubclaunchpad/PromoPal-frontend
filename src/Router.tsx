import React, { ReactElement } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import NavigationBar from './components/navigation/NavigationBar';
import { useAuthUser } from './contexts/AuthUserContext';
import Home from './screens/Home';
import Login from './screens/Login';
import MyAccount from './screens/MyAccount';
import MyPromotions from './screens/MyPromotions';

export default function Router(): ReactElement {
  const authUser = useAuthUser();
  return (
    <>
      <BrowserRouter>
        <NavigationBar />
        <Switch>
          <Route path="/account">{authUser ? <MyAccount /> : <Login />}</Route>
          <Route path="/promotion">
            <MyPromotions />
          </Route>
          <Route path="/promotion/upload">{/* <UploadPromotion /> */}</Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
}

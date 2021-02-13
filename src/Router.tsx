import React, { ReactElement } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import NavigationBar from './components/navigation/NavigationBar';
import { RestaurantCardProvider } from './contexts/RestaurantCardContext';
import Home from './screens/Home';
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
          <Route path="/promotion/upload">{/* <UploadPromotion /> */}</Route>
          <Route path="/">
            <RestaurantCardProvider>
              <Home />
            </RestaurantCardProvider>
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
}

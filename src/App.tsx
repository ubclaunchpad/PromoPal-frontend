import './index.less';

import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';

import { AuthUserProvider } from './contexts/AuthUserContext';
import { DropdownProvider } from './contexts/DropdownContext';
import { PromotionsListProvider } from './contexts/PromotionsListContext';
import { RestaurantCardProvider } from './contexts/RestaurantCardContext';
import Router from './Router';
import EnumService from './services/EnumService';
import GoogleMapsApiLoaderService from './services/GoogleMapsApiLoaderService';

function App(): ReactElement {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Loads dependencies on initial render.
   * Displays a spinner for the maximum of either: (a) the duration of the loading period or (b) ~2 seconds.
   */
  useEffect(() => {
    const start = Date.now();
    loadDependencies().finally(() => {
      const minWaitTime = 2000;
      const msWaited = Date.now() - start;
      setTimeout(() => setIsLoading(false), Math.max(0, minWaitTime - msWaited));
    });
  }, []);

  /**
   * Loads the following:
   * - Google Maps API
   * - Enums from BE
   */
  const loadDependencies = (): Promise<void[]> => {
    return Promise.all([GoogleMapsApiLoaderService.load(), EnumService.load()]);
  };

  const indicator = <LoadingOutlined className="spinner-icon" spin={true} />;

  return (
    <div className="App app-container">
      <AuthUserProvider>
        <PromotionsListProvider>
          <RestaurantCardProvider>
            <DropdownProvider>
              {isLoading ? <Spin indicator={indicator} className="spinner" /> : <Router />}
            </DropdownProvider>
          </RestaurantCardProvider>
        </PromotionsListProvider>
      </AuthUserProvider>
    </div>
  );
}

export default App;

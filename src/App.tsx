import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React, { CSSProperties, ReactElement, useEffect, useState } from 'react';

import Router from './Router';
import GoogleMapsApiLoaderService from './services/GoogleMapsApiLoaderService';

const styles: { [identifier: string]: CSSProperties } = {
  container: {
    height: '100%',
    width: '100%',
  },
  spinner: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  spinnerIcon: {
    fontSize: '4em',
  },
};

function App(): ReactElement {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Loads dependencies on initial render.
   * Displays a spinner for the maximum of either: (a) the duration of the loading period or (b) ~2 seconds.
   */
  useEffect(() => {
    const start = Date.now();
    GoogleMapsApiLoaderService.load().finally(() => {
      const minWaitTime = 2000;
      const msWaited = Date.now() - start;
      setTimeout(() => setIsLoading(false), Math.max(0, minWaitTime - msWaited));
    });
  }, []);

  const indicator = <LoadingOutlined style={styles.spinnerIcon} spin />;

  return (
    <div className="App" style={styles.container}>
      {isLoading ? <Spin indicator={indicator} style={styles.spinner} /> : <Router />}
    </div>
  );
}

export default App;

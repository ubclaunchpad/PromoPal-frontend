import React, { ReactElement } from 'react';

import Router from './Router';
import { DropdownProvider } from './contexts/DropdownContext';
import { PromotionsListProvider } from './contexts/PromotionsListContext';

function App(): ReactElement {
  return (
    <div className="App">
      <PromotionsListProvider>
        <DropdownProvider>
          <Router />
        </DropdownProvider>
      </PromotionsListProvider>
    </div>
  );
}

export default App;

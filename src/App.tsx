import React, { ReactElement } from 'react';

import { DropdownProvider } from './contexts/DropdownContext';
import { PromotionsListProvider } from './contexts/PromotionsListContext';
import Router from './Router';

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

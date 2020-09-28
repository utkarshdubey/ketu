// import { useState, useCallback } from "@hydrophobefireman/ui-lib";
import { Router,Path } from "@hydrophobefireman/ui-lib";
import "./App.css";

import { Home, HidePage, DecryptPage, NotFound } from './pages/exports';

export function App() {
  return (
    <>
      <Router defaultRoute="/" fallbackComponent={NotFound} inMemoryRouter={true}>
          <Path match="/" component={Home} />
          <Path match="/hide" component={HidePage} />
          <Path match="/decrypt" component={DecryptPage} />
      </Router>      
    </>
  )
}

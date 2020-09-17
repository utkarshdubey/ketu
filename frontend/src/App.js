// import { useState, useCallback } from "@hydrophobefireman/ui-lib";
import { Router,Path } from "@hydrophobefireman/ui-lib";
import "./App.css";

import { Home, NotFound } from './pages/exports';

export function App() {
  return (
    <>
      <Router fallbackComponent={NotFound}>
          <Path match="/" component={Home} />
      </Router>      
    </>
  )
}

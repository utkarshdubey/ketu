import { render, redirect, config } from "@hydrophobefireman/ui-lib";
import { App } from "./App";
import "./assets/main.css";
import "./assets/custom.css";

// Electron Fix
// config.inMemoryRouter = true;
// redirect('/');


// DOM Insertion
render(<App />, document.getElementById("app-mount"));
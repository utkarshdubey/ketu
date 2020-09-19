import { render, redirect } from "@hydrophobefireman/ui-lib";
import { App } from "./App";
import "./assets/main.css";

// DOM Insertion
redirect('/');
render(<App />, document.getElementById("app-mount"));
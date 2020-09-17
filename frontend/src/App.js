import { render, useState, useCallback } from "@hydrophobefireman/ui-lib";
import "./App.css";

function Clicker() {
  const [clicks, setClicks] = useState(0);
  const increment = useCallback(() => setClicks(clicks + 1), [clicks]);
  return (
    <>
      <div>Some UI Lib reactive component</div>
      <button onClick={increment}>Clicked {clicks} time(s)</button>
    </>
  );
}

function App() {
  return <main>{<Clicker />}</main>;
}

render(<App />, document.getElementById("app-mount"));

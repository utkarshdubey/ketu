import { useState, useCallback } from "@hydrophobefireman/ui-lib";
import "./App.css";

function Clicker() {
  const [clicks, setClicks] = useState(0);
  const increment = useCallback(() => setClicks(clicks + 1), [clicks]);
  return (
    <>
      <div>Some UI Lib reactive component</div>
      <button class="btn btn-blue bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={increment}>Clicked {clicks} time(s)</button>
    </>
  );
}

export function App() {
  return <main>{<Clicker />}</main>;
}



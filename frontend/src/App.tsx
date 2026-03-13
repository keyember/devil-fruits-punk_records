import { useState, useEffect } from "react";
import TerminalLayout from "./components/TerminalLayout";

const API_URL = "https://api-fruits.oudinallan.dev/";

function App() {
  const [fruits, setFruits] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setFruits(data))
      .catch(console.error);
  }, []);

  return <TerminalLayout fruits={fruits} />;
}

export default App;

import React, { useState } from "react";
import PizzaList from "./components/Pizza/PizzaList";
import AddPizza from "./components/Pizza/AddPizza";

function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div>
      <h1>🍕 Pizzeria</h1>
      <AddPizza onPizzaAdded={() => setRefresh(!refresh)} />
      <PizzaList key={refresh} />
    </div>
  );
}

export default App;

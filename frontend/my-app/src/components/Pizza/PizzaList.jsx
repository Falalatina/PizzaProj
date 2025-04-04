import React, { useState, useEffect } from "react";
import axios from "axios";
import DeletePizza from "./DeletePizza";

const API_URL = "http://127.0.0.1:5000";

const PizzaList = () => {
  const [pizzas, setPizzas] = useState([]);

  useEffect(() => {
    fetchPizzas();
  }, []);

  const fetchPizzas = async () => {
    try {
      const response = await axios.get(`${API_URL}/pizzas`);
      setPizzas(response.data);
    } catch (error) {
      console.error("Błąd podczas pobierania pizzy:", error);
    }
  };

  const handleDelete = (deletedPizzaId) => {
    setPizzas(pizzas.filter((pizza) => pizza._id !== deletedPizzaId));
  };

  return (
    <div>
      <h2>Lista Pizz</h2>
      <ul>
        {pizzas.map((pizza) => (
          <li key={pizza._id}>
            <h3>{pizza.nazwa}</h3>
            <p>Kategoria: {pizza.kategoria}</p>
            <p>Dodatki: {pizza.dodatki.join(", ")}</p>
            <p>Cena: {pizza.cena} zł</p>
            <img src={pizza.zdjecie} alt={pizza.nazwa} width="150" />
            <DeletePizza pizzaId={pizza._id} onDelete={handleDelete} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PizzaList;

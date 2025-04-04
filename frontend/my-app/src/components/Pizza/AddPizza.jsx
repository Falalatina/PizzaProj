import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";

const API_URL = "http://127.0.0.1:5000"; // Adres backendu

function AddPizza({ onPizzaAdded }) {
  const [pizza, setPizza] = useState({
    nazwa: "",
    kategoria: "",
    dodatki: "",
    cena: "",
    zdjecie: "",
  });

  const handleChange = (e) => {
    setPizza({ ...pizza, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${API_URL}/pizza`, {
        ...pizza,
        dodatki: pizza.dodatki.split(",").map((item) => item.trim()), // Zamiana stringa na tablicę
        cena: parseFloat(pizza.cena),
      })
      .then(() => {
        setPizza({
          nazwa: "",
          kategoria: "",
          dodatki: "",
          cena: "",
          zdjecie: "",
        });
        onPizzaAdded(); // Odświeżenie listy
      })
      .catch((error) => console.error("Błąd dodawania pizzy:", error));
  };

  return (
    <div>
      <h2>Dodaj nową pizzę</h2>
      <form onSubmit={handleSubmit}>
        <FormLabel>Nazwa</FormLabel>
        <Input
          type="text"
          name="nazwa"
          placeholder="Nazwa"
          value={pizza.nazwa}
          onChange={handleChange}
          required
        />
        <FormLabel>Kategoria</FormLabel>
        <Select
          type="text"
          name="kategoria"
          placeholder="Kategoria"
          value={pizza.kategoria}
          onChange={handleChange}
          required
        >
          <option>Klasyczna</option>
          <option>Fantazyjna</option>
        </Select>
        <FormLabel>Dodatki (oddzielone przecinkami)</FormLabel>
        <Input
          type="text"
          name="dodatki"
          placeholder="Dodatki (oddzielone przecinkami)"
          value={pizza.dodatki}
          onChange={handleChange}
          required
        />
        <FormLabel>Cena</FormLabel>
        <Input
          type="number"
          name="cena"
          placeholder="Cena"
          value={pizza.cena}
          onChange={handleChange}
          required
        />
        <FormLabel>Link do zdjęcia</FormLabel>
        <Input
          type="text"
          name="zdjecie"
          placeholder="Link do zdjęcia"
          value={pizza.zdjecie}
          onChange={handleChange}
          required
        />
        <Button type="submit">Dodaj pizzę</Button>
      </form>
    </div>
  );
}

export default AddPizza;

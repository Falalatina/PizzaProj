import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  Checkbox,
} from "@chakra-ui/react";

const API_URL = "http://127.0.0.1:5000"; // Adres backendu

function AddPizza({ onPizzaAdded }) {
  const { pizzaId } = useParams();
  const [pizza, setPizza] = useState({
    nazwa: "",
    kategoria: "",
    dodatki: [], // Zmieniamy na tablicę
    cena: "",
    zdjecie: "",
  });

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === "dodatki") {
      setPizza((prevPizza) => {
        const newDodatki = checked
          ? [...prevPizza.dodatki, value] // Dodajemy dodatek, jeśli checkbox jest zaznaczony
          : prevPizza.dodatki.filter((item) => item !== value); // Usuwamy dodatek, jeśli checkbox jest odznaczony

        return { ...prevPizza, dodatki: newDodatki };
      });
    } else {
      setPizza({ ...pizza, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${API_URL}/pizza`, {
        ...pizza,
        cena: parseFloat(pizza.cena),
      })
      .then(() => {
        setPizza({
          nazwa: "",
          kategoria: "",
          dodatki: [],
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
          name="kategoria"
          placeholder="Kategoria"
          value={pizza.kategoria}
          onChange={handleChange}
          required
        >
          <option>Klasyczna</option>
          <option>Fantazyjna</option>
        </Select>
        <FormControl as="fieldset">
          <FormLabel>Dodatki</FormLabel>

          <HStack spacing="24px" mt={4}>
            <Checkbox
              value="ser"
              name="dodatki"
              checked={pizza.dodatki.includes("ser")}
              onChange={handleChange}
            >
              Ser
            </Checkbox>
            <Checkbox
              value="pomidor"
              name="dodatki"
              checked={pizza.dodatki.includes("pomidor")}
              onChange={handleChange}
            >
              Pomidor
            </Checkbox>
            <Checkbox
              value="szynka"
              name="dodatki"
              checked={pizza.dodatki.includes("szynka")}
              onChange={handleChange}
            >
              Szynka
            </Checkbox>
            <Checkbox
              value="oliwki"
              name="dodatki"
              checked={pizza.dodatki.includes("oliwki")}
              onChange={handleChange}
            >
              Oliwki
            </Checkbox>
          </HStack>
        </FormControl>
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
        <Button m={5} type="submit">
          Dodaj pizzę
        </Button>
      </form>
    </div>
  );
}

export default AddPizza;

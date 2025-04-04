import React, { useState } from "react";
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

function EditPizza({ pizza, onPizzaUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPizza, setEditedPizza] = useState({ ...pizza });

  const handleEditClick = () => {
    setIsEditing(!isEditing); // Przełączanie stanu edycji
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === "dodatki") {
      setEditedPizza((prevPizza) => {
        const newDodatki = checked
          ? [...prevPizza.dodatki, value] // Dodajemy dodatek, jeśli checkbox jest zaznaczony
          : prevPizza.dodatki.filter((item) => item !== value); // Usuwamy dodatek, jeśli checkbox jest odznaczony

        return { ...prevPizza, dodatki: newDodatki };
      });
    } else {
      setEditedPizza({ ...editedPizza, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`${API_URL}/pizza/${pizza._id}`, {
        ...editedPizza,
        cena: parseFloat(editedPizza.cena),
      })
      .then(() => {
        onPizzaUpdated(); // Odświeżenie listy po edycji
        setIsEditing(false); // Zakończenie trybu edycji
      })
      .catch((error) => console.error("Błąd edytowania pizzy:", error));
  };

  return (
    <div>
      <Button colorScheme="teal" onClick={handleEditClick}>
        {isEditing ? "Anuluj" : "Edytuj"}
      </Button>

      {isEditing && (
        <form onSubmit={handleSubmit}>
          <FormLabel>Nazwa</FormLabel>
          <Input
            type="text"
            name="nazwa"
            value={editedPizza.nazwa}
            onChange={handleChange}
            required
          />
          <FormLabel>Kategoria</FormLabel>
          <Select
            name="kategoria"
            value={editedPizza.kategoria}
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
                checked={editedPizza.dodatki.includes("ser")}
                onChange={handleChange}
              >
                Ser
              </Checkbox>
              <Checkbox
                value="pomidor"
                name="dodatki"
                checked={editedPizza.dodatki.includes("pomidor")}
                onChange={handleChange}
              >
                Pomidor
              </Checkbox>
              <Checkbox
                value="szynka"
                name="dodatki"
                checked={editedPizza.dodatki.includes("szynka")}
                onChange={handleChange}
              >
                Szynka
              </Checkbox>
              <Checkbox
                value="oliwki"
                name="dodatki"
                checked={editedPizza.dodatki.includes("oliwki")}
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
            value={editedPizza.cena}
            onChange={handleChange}
            required
          />

          <FormLabel>Link do zdjęcia</FormLabel>
          <Input
            type="text"
            name="zdjecie"
            value={editedPizza.zdjecie}
            onChange={handleChange}
            required
          />

          <Button mt="4" colorScheme="blue" type="submit">
            Zapisz zmiany
          </Button>
        </form>
      )}
    </div>
  );
}

export default EditPizza;

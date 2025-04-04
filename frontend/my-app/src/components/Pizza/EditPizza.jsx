import React, { useState, useEffect } from "react";
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

  // Funkcja obsługująca kliknięcie przycisku edycji
  const handleEditClick = () => {
    setIsEditing(!isEditing); // Przełączanie stanu edycji
  };

  // Funkcja do obsługi zmiany danych w formularzu
  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === "dodatki") {
      // Obsługuje dodatki (checkbox)
      setEditedPizza((prevPizza) => {
        let newDodatki = [...prevPizza.dodatki];

        if (checked && !newDodatki.includes(value)) {
          // Dodajemy dodatek, jeśli nie ma go jeszcze w tablicy
          newDodatki.push(value);
        } else if (!checked) {
          // Usuwamy dodatek, jeśli checkbox jest odznaczony
          newDodatki = newDodatki.filter((item) => item !== value);
        }

        return { ...prevPizza, dodatki: newDodatki };
      });
    } else {
      setEditedPizza({ ...editedPizza, [name]: value });
    }
  };

  // Funkcja do obsługi wysyłania formularza
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

  // Funkcja do sprawdzenia, czy dodatek już istnieje w pizzy
  const isChecked = (item) => {
    return editedPizza.dodatki && editedPizza.dodatki.includes(item);
  };

  useEffect(() => {
    // Sprawdzamy, czy dodatki są poprawnie wczytane
    setEditedPizza({ ...pizza });
  }, [pizza]);

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

          <FormLabel>Dodatki</FormLabel>
          <HStack spacing="24px" mt={4}>
            {["ser", "pomidor", "szynka", "oliwki"].map((item) => (
              <Checkbox
                key={item}
                value={item}
                name="dodatki"
                checked={isChecked(item)} // Sprawdzamy, czy dany dodatek jest w tablicy
                onChange={handleChange}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Checkbox>
            ))}
          </HStack>

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

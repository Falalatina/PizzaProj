import React from "react";
import { Button } from "@chakra-ui/react";
import axios from "axios";

const API_URL = "http://127.0.0.1:5000"; // Zaktualizuj, jeśli API URL jest inny

const DeletePizza = ({ pizzaId, onDelete }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/pizza/${pizzaId}`);
      onDelete(pizzaId); // Powiadomienie o usunięciu
    } catch (error) {
      console.error("Błąd podczas usuwania pizzy:", error);
    }
  };

  return (
    <Button colorScheme="red" onClick={handleDelete}>
      Usuń
    </Button>
  );
};

export default DeletePizza;

import React from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:5000"; // Upewnij się, że to poprawny adres backendu

const DeletePizza = ({ pizzaId, onDelete }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/pizza/${pizzaId}`);
      alert("Pizza została usunięta!");
      onDelete(pizzaId); // Aktualizuje listę po usunięciu
    } catch (error) {
      console.error("Błąd podczas usuwania pizzy:", error);
      alert("Nie udało się usunąć pizzy!");
    }
  };

  return (
    <button onClick={handleDelete} style={styles.button}>
      Usuń pizzę
    </button>
  );
};

const styles = {
  button: {
    backgroundColor: "#ff4d4d",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default DeletePizza;

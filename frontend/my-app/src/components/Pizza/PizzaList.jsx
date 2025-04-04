import React, { useState, useEffect } from "react";
import axios from "axios";
import DeletePizza from "./DeletePizza";
import {
  Card,
  CardBody,
  Image,
  Stack,
  Heading,
  Text,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import EditPizza from "./EditPizza";

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
  const handlePizzaUpdated = () => {
    fetchPizzas(); // Odświeżenie listy po edycji
  };

  return (
    <div>
      <h2>Lista Pizz</h2>
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
        {pizzas.map((pizza) => (
          <GridItem key={pizza._id}>
            <Card maxW="sm">
              <CardBody>
                <Image
                  src={pizza.zdjecie}
                  alt={pizza.nazwa}
                  borderRadius="lg"
                  boxSize="60vh"
                  objectFit="cover"
                />
                <Stack mt="6" spacing="3">
                  <Heading size="md">{pizza.nazwa}</Heading>
                  <Text>
                    <p>Kategoria: {pizza.kategoria}</p>
                    <p>
                      Dodatki:{" "}
                      {Array.isArray(pizza.dodatki)
                        ? pizza.dodatki.join(", ")
                        : "Brak dodatków"}
                    </p>
                  </Text>
                  <Text color="blue.600" fontSize="2xl">
                    <p>Cena: {pizza.cena} zł</p>
                  </Text>
                </Stack>
                <EditPizza pizza={pizza} onPizzaUpdated={handlePizzaUpdated} />
                <DeletePizza pizzaId={pizza._id} onDelete={handleDelete} />
              </CardBody>
            </Card>
          </GridItem>
        ))}
      </Grid>
    </div>
  );
};

export default PizzaList;

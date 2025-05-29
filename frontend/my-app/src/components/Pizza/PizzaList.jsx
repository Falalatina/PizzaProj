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
import AddToCart from "./AddToCart";

const API_URL = "http://127.0.0.1:5000";

const PizzaList = ({ isAdmin, addPizzaToCart, countTotal }) => {
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
      <Heading
        as="h1"
        fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
        fontWeight="800"
        color="#F97316"
        textAlign="center"
        mb={8}
        position="relative"
        _after={{
          content: '""',
          position: "absolute",
          bottom: "-8px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          height: "4px",
          bg: "linear-gradient(90deg, #F97316 0%, #FFB800 100%)",
          borderRadius: "full",
        }}
        textTransform="uppercase"
        letterSpacing={{ base: "1px", md: "2px" }}
        fontFamily="'Barlow', sans-serif"
        textShadow="0 2px 10px rgba(24, 21, 189, 0.42)"
      >
        Lista Pizz
      </Heading>
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
                {isAdmin ? (
                  <>
                    <EditPizza
                      pizza={pizza}
                      onPizzaUpdated={handlePizzaUpdated}
                    />
                    <DeletePizza pizzaId={pizza._id} onDelete={handleDelete} />
                  </>
                ) : (
                  <AddToCart
                    addPizzaToCart={addPizzaToCart}
                    cena={pizza.cena}
                    pizza={pizza}
                    countTotal={countTotal}
                  />
                )}
              </CardBody>
            </Card>
          </GridItem>
        ))}
      </Grid>
    </div>
  );
};

export default PizzaList;

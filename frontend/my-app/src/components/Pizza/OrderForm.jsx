import React, { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  Spinner,
  Grid,
  GridItem,
  Card,
  CardBody,
  Heading,
  useToast,
} from "@chakra-ui/react";

const OrderForm = ({ pizzas = [], subtotal = 0, onOrderComplete }) => {
  const [formData, setFormData] = useState({
    imie_klienta: "",
    nazwisko_klienta: "",
    adres_klienta: "",
    telefon_klienta: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [orderMessage, setOrderMessage] = useState("");
  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { imie_klienta, nazwisko_klienta, adres_klienta, telefon_klienta } =
      formData;

    if (!imie_klienta.trim()) return "Imię jest wymagane";
    if (!nazwisko_klienta.trim()) return "Nazwisko jest wymagane";
    if (!adres_klienta.trim()) return "Adres jest wymagany";
    if (!telefon_klienta.trim()) return "Telefon jest wymagany";
    if (pizzas.length === 0) return "Brak pizz w zamówieniu";

    const phoneRegex = /^[0-9\s\-\+\(\)]{9,}$/;
    if (!phoneRegex.test(telefon_klienta))
      return "Nieprawidłowy format telefonu";

    return null;
  };

  const handleSubmit = async () => {
    console.log("Rozpoczynamy składanie zamówienia...");

    const validationError = validateForm();
    if (validationError) {
      setOrderStatus("error");
      setOrderMessage(validationError);
      toast({
        title: "Błąd walidacji",
        description: validationError,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!pizzas || pizzas.length === 0) {
      setOrderStatus("error");
      const errorMsg = "Koszyk jest pusty.";
      setOrderMessage(errorMsg);
      toast({
        title: "Błąd zamówienia",
        description: errorMsg,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    setOrderStatus(null);

    try {
      // Grupowanie pizz po ID i liczenie ilości
      const pizzasWithQuantity = pizzas.reduce((acc, pizza) => {
        const existing = acc.find((p) => p._id === pizza._id);
        if (existing) {
          existing.ilosc += 1;
        } else {
          acc.push({
            _id: pizza._id,
            nazwa: pizza.nazwa,
            cena: pizza.cena,
            ilosc: 1,
          });
        }
        return acc;
      }, []);

      const orderData = {
        imie_klienta: formData.imie_klienta,
        nazwisko_klienta: formData.nazwisko_klienta,
        adres_klienta: formData.adres_klienta,
        telefon_klienta: formData.telefon_klienta,
        pizze: pizzasWithQuantity,
        subtotal: subtotal,
      };

      console.log("Wysyłane zamówienie:", orderData);

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      console.log("Odpowiedź serwera:", result);

      if (response.ok) {
        setOrderStatus("success");
        setOrderMessage(
          `Zamówienie zostało przyjęte! Numer zamówienia: ${result.order_id}`
        );

        toast({
          title: "Zamówienie złożone!",
          description: `Numer zamówienia: ${result.order_id}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setFormData({
          imie_klienta: "",
          nazwisko_klienta: "",
          adres_klienta: "",
          telefon_klienta: "",
        });

        if (onOrderComplete) {
          onOrderComplete(result);
        }
      } else {
        const msg =
          result.error || "Wystąpił błąd podczas składania zamówienia";
        setOrderStatus("error");
        setOrderMessage(msg);
        toast({
          title: "Błąd zamówienia",
          description: msg,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Błąd połączenia z API:", error);
      setOrderStatus("error");
      setOrderMessage("Błąd połączenia z serwerem. Spróbuj ponownie.");
      toast({
        title: "Błąd połączenia",
        description: "Błąd połączenia z serwerem. Spróbuj ponownie.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Zlicz ilość każdej pizzy (po _id)
  const pizzaQuantities = pizzas.reduce((acc, pizza) => {
    acc[pizza._id] = (acc[pizza._id] || 0) + 1;
    return acc;
  }, {});

  // Unikalne pizze z ilością
  const uniquePizzas = pizzas.reduce((acc, pizza) => {
    if (!acc.find((p) => p._id === pizza._id)) {
      acc.push({
        ...pizza,
        ilosc: pizzaQuantities[pizza._id],
      });
    }
    return acc;
  }, []);

  const totalPizzas = pizzas.length;

  return (
    <Box maxW="2xl" mx="auto" p={6}>
      <Card>
        <CardBody>
          <VStack spacing={6} align="stretch">
            {/* Header */}
            <HStack spacing={3}>
              <Box color="red.500" fontSize="2xl">
                🛒
              </Box>
              <Heading size="lg" color="gray.800">
                Finalizacja Zamówienia
              </Heading>
            </HStack>

            {/* Podsumowanie zamówienia */}
            <Card bg="gray.50">
              <CardBody>
                <Heading size="md" mb={4} color="gray.700">
                  Podsumowanie zamówienia
                </Heading>
                <VStack spacing={2} align="stretch">
                  {uniquePizzas.map((pizza, index) => (
                    <HStack key={index} justify="space-between">
                      <Text fontSize="sm" color="gray.600">
                        {pizza.nazwa} x{pizza.ilosc}
                      </Text>
                      <Text fontWeight="medium">
                        {(pizza.cena * pizza.ilosc).toFixed(2)} zł
                      </Text>
                    </HStack>
                  ))}
                  <Divider />
                  <HStack justify="space-between" fontWeight="bold">
                    <Text>Razem ({totalPizzas} szt.)</Text>
                    <Text fontSize="lg" color="red.600">
                      {subtotal.toFixed(2)} zł
                    </Text>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Status Alert */}
            {orderStatus && (
              <Alert
                status={orderStatus}
                variant="subtle"
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                borderRadius="md"
              >
                <AlertIcon />
                <Box>
                  <AlertTitle>
                    {orderStatus === "success" ? "Sukces!" : "Błąd!"}
                  </AlertTitle>
                  <AlertDescription fontSize="sm">
                    {orderMessage}
                  </AlertDescription>
                </Box>
              </Alert>
            )}

            {/* Formularz */}
            <VStack spacing={4} align="stretch">
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="medium">
                      👤 Imię
                    </FormLabel>
                    <Input
                      name="imie_klienta"
                      value={formData.imie_klienta}
                      onChange={handleInputChange}
                      placeholder="Wpisz swoje imię"
                      focusBorderColor="red.500"
                    />
                  </FormControl>
                </GridItem>

                <GridItem>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="medium">
                      👤 Nazwisko
                    </FormLabel>
                    <Input
                      name="nazwisko_klienta"
                      value={formData.nazwisko_klienta}
                      onChange={handleInputChange}
                      placeholder="Wpisz swoje nazwisko"
                      focusBorderColor="red.500"
                    />
                  </FormControl>
                </GridItem>
              </Grid>

              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="medium">
                  📍 Adres dostawy
                </FormLabel>
                <Input
                  name="adres_klienta"
                  value={formData.adres_klienta}
                  onChange={handleInputChange}
                  placeholder="Ulica, numer domu/mieszkania, miasto"
                  focusBorderColor="red.500"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="medium">
                  📞 Telefon
                </FormLabel>
                <Input
                  type="tel"
                  name="telefon_klienta"
                  value={formData.telefon_klienta}
                  onChange={handleInputChange}
                  placeholder="np. 123 456 789"
                  focusBorderColor="red.500"
                />
              </FormControl>

              <Button
                onClick={handleSubmit}
                isLoading={isSubmitting}
                loadingText="Składanie zamówienia..."
                isDisabled={pizzas.length === 0}
                colorScheme="red"
                size="lg"
                w="full"
                leftIcon={isSubmitting ? <Spinner size="sm" /> : undefined}
              >
                {!isSubmitting && `Złóż zamówienie - ${subtotal.toFixed(2)} zł`}
              </Button>
            </VStack>

            <Text fontSize="xs" color="gray.500" textAlign="center">
              * - pola wymagane
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default OrderForm;

import React, { useState } from "react";
import PizzaList from "./components/Pizza/PizzaList";
import AddPizza from "./components/Pizza/AddPizza";
import "./App.css";
import { Button, Heading } from "@chakra-ui/react";
import OrderForm from "./components/Pizza/OrderForm";

function App() {
  const [refresh, setRefresh] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [pizzas, setPizzas] = useState([]);
  const [amount, setAmount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);

  console.log(pizzas);

  function addPizzaToCart(pizza) {
    setAmount(amount + 1);
    setPizzas((prevPizzas) => [...prevPizzas, pizza]);
  }

  function countTotal(prix) {
    setSubtotal(subtotal + prix);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Heading
        as="h1"
        fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
        fontWeight="800"
        color="white"
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
        textShadow="0 2px 10px rgba(249, 115, 22, 0.3)"
      >
        🍕Pizzeria🍕
      </Heading>
      <div className="top-bar-container">
        <button
          onClick={() => setOpenCart(!openCart)}
          style={{
            fontSize: "24px",
            padding: "10px 16px",
            borderRadius: "8px",
            backgroundColor: "#f97316",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          🛒 {amount} szt.
        </button>
        <p style={{ fontSize: "24px", margin: 0 }}>{subtotal.toFixed(2)} zł</p>
        <Button
          onClick={() => setIsAdmin(!isAdmin)}
          style={{ marginLeft: "auto", borderColor: "blue" }}
        >
          Admin
        </Button>
      </div>

      {isAdmin ? <AddPizza onPizzaAdded={() => setRefresh(!refresh)} /> : ""}

      {openCart ? <OrderForm subtotal={subtotal} pizzas={pizzas} /> : ""}

      <PizzaList
        key={refresh}
        isAdmin={isAdmin}
        addPizzaToCart={addPizzaToCart}
        countTotal={countTotal}
      />
    </div>
  );
}

export default App;

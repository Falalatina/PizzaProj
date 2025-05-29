import { Button } from "@chakra-ui/react";
import React from "react";

const AddToCart = ({ addPizzaToCart, cena, countTotal, pizza }) => {
  const handleClick = () => {
    addPizzaToCart(pizza);
    countTotal(cena);
  };
  return (
    <div>
      <Button onClick={handleClick} mt={10} color={"blue"}>
        AddToCart
      </Button>
    </div>
  );
};

export default AddToCart;

import React, { useEffect, useState } from "react";
import Item from "./Item";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Row } from "react-bootstrap";

function SItem() {
  let { itemId } = useParams();
  const [item, setItem] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:9000/items/${itemId}`, {
        withCredentials: true,
      })
      .then((res) => {
        setItem(res.data.item);
      });
  }, [itemId]);

  return (
    <div>
      <Row>
        <Item
          name={item.name}
          currency={item.currency}
          price={item.price}
          quantity={item.quantity}
          single={true}
          image={item.image}
        />
      </Row>
    </div>
  );
}

export default SItem;

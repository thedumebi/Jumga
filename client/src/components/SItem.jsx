import React, { useEffect, useState } from "react";
import Item from "./Item";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Row } from "react-bootstrap";

function SItem(props) {
  let { itemId } = useParams();
  const [item, setItem] = useState({});

  useEffect(() => {
    axios
      .get(`/api/items/${itemId}`, {
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
          id={item.id}
          name={item.name}
          currency={item.currency}
          price={item.price}
          quantity={item.quantity}
          single={true}
          image={item.image}
          vendor_id={item.vendor_id}
          user={props.user}
        />
      </Row>
    </div>
  );
}

export default SItem;

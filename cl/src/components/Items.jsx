import React, { useState, useEffect } from "react";
import axios from "axios";
import Item from "./Item";
import { Row, Col, Container } from "react-bootstrap";

function Items(props) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9000/items", { withCredentials: true })
      .then((res) => {
        setItems(res.data.items);
      });
  }, []);

  return (
    <Container>
      <Row>
        {items.map((item) => {
          return (
            <Col lg={3}>
              <Item
                key={item._id}
                id={item.id}
                name={item.name}
                currency={item.currency}
                price={item.price}
                quantity={item.quantity}
                image={item.image}
                vendor_id={item.vendor_id}
                user={props.user}
              />
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}

export default Items;

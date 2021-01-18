import React, { useState, useEffect } from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button } from "react-bootstrap";

function BuyItem(props) {
  let { itemId } = useParams();
  const history = useHistory();
  const [buy, setBuy] = useState({
    name: "",
    price: "",
    quantity: "",
    available_quantity: "",
    vendor_id: "",
    item_id: "",
    shop_id: "",
    currency: "",
    delivery: "",
  });
  const [item, setItem] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:9000/items/${itemId}`, {
        withCredentials: true,
      })
      .then((res) => {
        setItem(res.data.item);
        alert(`There are ${res.data.item.quantity} left in stock`);
        setBuy({
          name: res.data.item.name,
          price: res.data.item.price,
          available_quantity: res.data.item.quantity,
          vendor_id: res.data.item.vendor_id,
          item_id: res.data.item.id,
          shop_id: res.data.item.shop_id,
          currency: res.data.item.currency,
          delivery:
            res.data.item.currency === "NGN"
              ? 1500
              : res.data.item.currency === "GHS"
              ? 1000
              : res.data.item.currency === "KES"
              ? 2000
              : 30,
        });
      });
  }, [itemId]);

  function handleChange(event) {
    const { name, value } = event.target;
    setBuy((prevValues) => {
      return { ...prevValues, [name]: value };
    });
  }

  function buyItem() {
    const url = `http://localhost:9000/items/${itemId}/buy`;
    axios.post(url, buy, { withCredentials: true }).then((res) => {
      if (res.data.status === "initialized") {
        window.location.replace(res.data.link);
      } else {
        history.push(`/items/${itemId}/buy`);
        alert("Something went wrong, please try again later!");
      }
    });
  }
  
  if (!props.user) {
    return <Redirect to="/login" />;
  }

  return (
    <Container>
      <h4>There are {item.quantity} left in stock</h4>
      <p>
        Delivery fee is {item.currency}{" "}
        {item.currency === "NGN"
          ? 1500
          : item.currency === "GHS"
          ? 1000
          : item.currency === "KES"
          ? 2000
          : 30}
      </p>
      <Form>
        <Form.Group>
          <Form.Label>Item Name</Form.Label>
          <Form.Control
            onChange={handleChange}
            name="name"
            type="text"
            placeholder="Enter item name"
            value={item.name}
            readOnly
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Item Unit Price</Form.Label>
          <Form.Control
            onChange={handleChange}
            name="price"
            type="number"
            placeholder="Enter item price"
            value={item.price}
            readOnly
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Item Quantity</Form.Label>
          <Form.Control
            onChange={handleChange}
            name="quantity"
            type="number"
            placeholder="How many units do you want?"
            value={buy.quantity}
          />
        </Form.Group>
        <Button className="btn-lg btn-dark" onClick={buyItem}>
          Buy Item
        </Button>
      </Form>
    </Container>
  );
}

export default BuyItem;

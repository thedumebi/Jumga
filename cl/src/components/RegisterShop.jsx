import React, { useState } from "react";
import { Form, Container, Button, Col } from "react-bootstrap";

function RegisterShop() {
  alert("Your shop would not be registered until payment ($20) is confirmed!");
  const [shop, setShop] = useState({
    name: "",
    email: "",
    country: "",
    bank: "",
    account_number: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setShop((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  function addShop() {}

  return (
    <Container>
      <Form>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            onChange={handleChange}
            name="name"
            type="text"
            placeholder="Enter Shop Name"
            value={shop.name}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            onChange={handleChange}
            name="email"
            type="email"
            placeholder="Enter Shop Email Address"
            value={shop.email}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Country</Form.Label>
          <Form.Control
            onChange={handleChange}
            name="country"
            as="select"
            value={shop.country}
          >
            <option value="">pick your country ...</option>
            <option value="NGN">Nigeria</option>
            <option value="GHS">Ghana</option>
            <option value="KES">Kenya</option>
            <option value="GBP">UK</option>
          </Form.Control>
        </Form.Group>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Bank</Form.Label>
            <Form.Control
              onChange={handleChange}
              name="bank"
              type="text"
              placeholder="Enter Bank Name"
              value={shop.bank}
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Account Number</Form.Label>
            <Form.Control
              onChange={handleChange}
              name="account_number"
              type="text"
              placeholder="Enter your account Number"
              value={shop.account_number}
            />
          </Form.Group>
        </Form.Row>
        <Button className="btn-lg btn-dark" onClick={addShop}>
          Register Shop
        </Button>
      </Form>
    </Container>
  );
}

export default RegisterShop;

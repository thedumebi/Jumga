import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Container } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";

function AddItem() {
  const history = useHistory();
  const { shopId } = useParams();

  const [item, setItem] = useState({
    name: "",
    price: "",
    currency: "",
    quantity: "",
    shop_id: shopId,
  });
  const [image, setImage] = useState(null);

  function handleFileChange(event) {
    console.log(event.target.files)
    const { files } = event.target;
    setImage(files[0]);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setItem((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  function addItem() {
      const data = new FormData();
      for (const name in item) {
          data.append(name, item[name])
      }
      data.append("image", image);
    const url = `/api/vendor/${shopId}/additem`;
    axios.post(url, data, { withCredentials: true }).then((res) => {
      console.log(res);
      history.push(`/items/${res.data.itemId}`);
    });
  }

  return (
    <Container>
      <Form encType="multipart/form-data">
        <Form.Group>
          <Form.Label>Item Name</Form.Label>
          <Form.Control
            onChange={handleChange}
            name="name"
            type="text"
            placeholder="Enter item name"
            value={item.name}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Item Currency</Form.Label>
          <Form.Control
            onChange={handleChange}
            name="currency"
            as="select"
            placeholder="Pick your country"
            value={item.currency}
          >
            <option value="">pick your country ...</option>
            <option value="NGN">Nigeria</option>
            <option value="GHS">Ghana</option>
            <option value="KES">Kenya</option>
            <option value="GBP">UK</option>
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Item Price</Form.Label>
          <Form.Control
            onChange={handleChange}
            name="price"
            type="number"
            placeholder="Enter item price"
            value={item.price}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Item Quantity</Form.Label>
          <Form.Control
            onChange={handleChange}
            name="quantity"
            type="number"
            placeholder="Number of items available"
            value={item.quantity}
          />
        </Form.Group>
        <Form.Group>
          <Form.File
            label="Upload Item Image"
            name="image"
            onChange={handleFileChange}
          />
        </Form.Group>
        <Button className="btn-lg btn-dark" onClick={addItem}>
          Add New Item
        </Button>
      </Form>
    </Container>
  );
}

export default AddItem;

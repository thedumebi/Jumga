import React, { useState, useEffect } from "react";
import axios from "axios";
import Shop from "./Shop";
import { Row, Col, Container } from "react-bootstrap";

function Shops() {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9000/shops/", { withCredentials: true })
      .then((res) => {
        console.log(res.data.shops)
        setShops(res.data.shops);
      });
  }, []);

  return (
    <Container>
        <Row>
          {shops.map((shop) => {
            return (
              <Col lg={4}>
                <Shop
                  key={shop._id}
                  id={shop.id}
                  name={shop.name}
                  items={shop.items}
                />
              </Col>
            );
          })}
        </Row>
    </Container>
  );
}

export default Shops;

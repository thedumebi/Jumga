import React, { useState, useEffect } from "react";
import axios from "axios";
import Shop from "./Shop";
import { Row, Col, Container } from "react-bootstrap";

function Shops(props) {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9000/shops/", { withCredentials: true })
      .then((res) => {
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
                  user={props.user}
                />
              </Col>
            );
          })}
        </Row>
    </Container>
  );
}

export default Shops;

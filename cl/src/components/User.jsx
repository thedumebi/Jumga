import React from "react";
import { Link } from "react-router-dom";
import Shop from "./Shop";
import { Container, Button, Row, Col } from "react-bootstrap";
import Bought from "./Bought";

function User(props) {
  console.log(props.user);
  return (
    <Container>
      <div>
        <h1 className="center big-heading">Welcome {props.user.name}</h1>
        {props.user.role === "vendor" && props.user.shops && (
          <Row>
            {props.user.shops.map((shop) => {
              return (
                <Col lg={6}>
                  <Shop
                    key={shop.id}
                    id={shop.id}
                    name={shop.name}
                    country={shop.country}
                  />
                </Col>
              );
            })}
          </Row>
        )}
        {props.user.role === "dispatch" && (
          <div>
            <p>{props.user.shops.length === 0 ? "You currently don't have any shops under you ☹" : "These are the shops you make deliveries for"}</p>
            {props.user.shops &&
              props.user.shops.map((shop) => {
                return (
                  <Shop
                    key={shop.id}
                    id={shop.id}
                    name={shop.name}
                    country={shop.country}
                  />
                );
              })}
          </div>
        )}
        {props.user.role === "client" && (
          <h3>
            Start shopping by
            <Link to="/shops">
              <Button className="btn-dark">shops</Button>
            </Link>
            or by
            <Link to="/items">
              <Button className="btn-dark">items</Button>
            </Link>
          </h3>
        )}
        {props.user.bought_items && props.user.bought_items.length !== 0 && (
          <Container>
            <h3 className="sub-heading">Purchase History</h3>
            <Row>
              {props.user.bought_items.map((item) => {
                return (
                  <Col lg={4}>
                    <Bought
                      key={item.tx_ref}
                      name={item.item_name}
                      quantity={item.item_quantity}
                      tx_ref={item.tx_ref}
                    />
                  </Col>
                );
              })}
            </Row>
          </Container>
        )}
        {props.user.role === "vendor" && (
          <Link to="/registershop">
            <Button className="btn-dark">Register a new shop</Button>
          </Link>
        )}
      </div>
    </Container>
  );
}

export default User;

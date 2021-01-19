import React from "react";
import Bought from "./Bought";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Redirect, Link } from "react-router-dom";

function History(props) {
  if (!props.user) {
    return <Redirect to="/login" />;
  }
  return (
    <Container>
      {props.user.bought_items.length !== 0 ? (
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
      ) : (
        <div>
          <p>You have no purchase history</p>
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
        </div>
      )}
    </Container>
  );
}

export default History;

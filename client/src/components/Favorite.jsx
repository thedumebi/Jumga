import React from "react";
import { Redirect, Link } from "react-router-dom";
import { Container, Row , Button} from "react-bootstrap";
import Item from "./Item";

function Favorite(props) {
  if (!props.user) {
    return <Redirect to="/login" />;
  }
  return (
    <Container>
      {props.user.favorites.length !== 0 ? (
        <Row>
          {props.user.favorites.map((item) => {
            return (
              <Item 
                key={item.id}
                id={item.id}
                name={item.name}
                currency={item.currency}
                price={item.price}
                shopImage={item.image}
              />
            )
          })}
        </Row>
      ) : (
        <div>
          <p>You have no favorites yet!</p>
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

export default Favorite;

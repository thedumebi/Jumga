import React from "react";
import Item from "./Item";
import { Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";

function Shop(props) {
  return (
    <Container>
      <div className="shop">
        <h1 className="heading">{props.name}</h1>
        {props.country && (
          <p>Items in this shop are sold in {props.country}</p>
        )}
        <div className="content" style={props.single && { height: "100%" }}>
          {props.items &&
            props.items.map((item) => {
              return (
                <Item
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  quantity={item.quantity}
                  currency={item.currency}
                  shopImage={item.image}
                  user={props.user}
                />
              );
            })}
        </div>
        {!props.single && (
          <Link to={`shops/${props.id}`}>
            <Button className="btn-dark" type="button">
              Visit Shop
            </Button>
          </Link>
        )}
        {props.user &&
          props.user.role === "vendor" &&
          props.user.id === props.id && (
            <Link to={`/vendor/${props.id}/additem`}>
              <Button className="btn-dark">Add a new item</Button>
            </Link>
          )}
      </div>
    </Container>
  );
}

export default Shop;

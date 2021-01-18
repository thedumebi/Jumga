import React from "react";
import { Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";

function Item(props) {
  var imageSrc = "";
  function arrayBufferToBase64(buffer) {
    var binary = "";
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return window.btoa(binary);
  }
  if (props.image) {
    const base64Flag = `data:${props.image.contentType};base64,`;
    const imageString = arrayBufferToBase64(props.image.data.data);
    imageSrc = base64Flag + imageString;
  }
  if (props.shopImage) {
    const base64Flag = `data:${props.shopImage.contentType};base64,`;
    imageSrc = base64Flag + props.shopImage.data;
  }

  return (
    <Container>
      <div className="shop">
        {props.image && (
          <div className="heading" style={props.single && { width: "50%" }}>
            <img src={imageSrc} alt="item" />
          </div>
        )}
        {props.shopImage && (
          <div className="heading" style={props.single && { width: "50%" }}>
            <img src={imageSrc} alt="item" />
          </div>
        )}
        <div className="content" style={props.single && { height: "100%" }}>
          <h1 className="sub-heading">{props.name}</h1>
          <p>
            {props.currency} {props.price}
          </p>
          <p>There are {props.quantity} left in stock</p>
        </div>
        {!props.single && (
          <Link to={`/items/${props.id}`}>
            <Button className="btn-dark" type="button">
              View Item
            </Button>
          </Link>
        )}
        {props.user &&
          props.vendor_id &&
          props.user.role === "vendor" &&
          props.user.id !== props.vendor_id && (
            <Link to={`/items/${props.id}/buy`}>
              <Button className="btn-dark" type="button">
                Buy Item
              </Button>
            </Link>
          )}
        {props.user && props.user.role !== "vendor" && (
          <Link to={`/items/${props.id}/buy`}>
            <Button className="btn-dark" type="button">
              Buy Item
            </Button>
          </Link>
        )}
        {!props.user && (
          <Link to={`/items/${props.id}/buy`}>
            <Button className="btn-dark" type="button">
              Buy Item
            </Button>
          </Link>
        )}
      </div>
    </Container>
  );
}

export default Item;

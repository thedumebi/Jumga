import React, {useState} from "react";
import { Link } from "react-router-dom";
import { Container, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { Favorite, FavoriteBorder } from "@material-ui/icons";
import Fab from "@material-ui/core/Fab";

function Item(props) {
  const [value, setValue] = useState(false);
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

  function addFavorite(event) {
    const url = `http://localhost:9000/items/${props.id}/favorite`;
    axios.get(url, { withCredentials: true }).then((res) => {
      if (res.data.status === "success") {
        <Alert variant="success"><p>Item successfully added to your favorites</p></Alert>
        setValue(!value);
      }
    });
    event.preventDefault();
  }

  function removeFavorite(event) {
    const url = `http://localhost:9000/items/${props.id}/unfavorite`;
    axios.get(url, { withCredentials: true }).then((res) => {
      if (res.data.status === "success") {
        setValue(!value);
      }
    });
    event.preventDefault();
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
        {props.single &&
          props.user &&
          props.user.role === "vendor" &&
          props.user.id !== props.vendor_id &&
          !props.user.favorites.includes(
            props.user.favorites.find((el) => el.id === props.id)
          ) && <Fab onClick={addFavorite}><FavoriteBorder /></Fab>}
        {props.single &&
          props.user &&
          props.user.role !== "vendor" &&
          !props.user.favorites.includes(
            props.user.favorites.find((el) => el.id === props.id)
          ) && <Fab onClick={addFavorite}><FavoriteBorder /></Fab>}
        {props.single &&
          props.user &&
          props.user.role === "vendor" &&
          props.user.id !== props.vendor_id &&
          props.user.favorites.includes(
            props.user.favorites.find((el) => el.id === props.id)
          ) && <Fab onClick={removeFavorite}><Favorite /></Fab>}
        {props.single &&
          props.user &&
          props.user.role !== "vendor" &&
          props.user.favorites.includes(
            props.user.favorites.find((el) => el.id === props.id)
          ) && <Fab onClick={removeFavorite}><Favorite /></Fab>}
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

import React from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";

function Logout(props) {
  const history = useHistory();

  function handleClick() {
    axios
    .get("http://localhost:9000/logout", { withCredentials: true })
    .then((res) => {
      if (res.data.status === "success") {
        props.user(null);
        history.push("/");
      }
    });
  }

  return <Button className="btn-lg btn-dark" onClick={handleClick}>Log Out</Button>;
}

export default Logout;

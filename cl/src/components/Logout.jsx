import React from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

function Logout(props) {
  const history = useHistory();
  axios
    .get("http://localhost:9000/logout", { withCredentials: true })
    .then((res) => {
      if (res.data.status === "success") {
        props.user(null);
        history.push("/");
      }
    });

  return <h1>Bye</h1>;
}

export default Logout;

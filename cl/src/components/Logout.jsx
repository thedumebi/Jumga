import React from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

function Logout() {
  const history = useHistory();
  axios
    .get("http://localhost:9000/logout", { withCredentials: true })
    .then((res) => {
      res.data.status === "success" && history.push("/");
    });

  return <h1>Bye</h1>;
}

export default Logout;

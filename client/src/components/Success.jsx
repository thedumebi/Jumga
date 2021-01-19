import React, { useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Success() {
  const query1 = new URLSearchParams(window.location.search).get("status");
  const query2 = new URLSearchParams(window.location.search).get("tx_ref");
  const query3 = new URLSearchParams(window.location.search).get(
    "transaction_id"
  );
  const [status, setStatus] = useState(false);

  function verify() {
    const url = `http://localhost:9000/success?status=${query1}&tx_ref=${query2}&transaction_id=${query3}`;
    axios.get(url, { withCredentials: true }).then((res) => {
      if (res.status === 200) {
        setStatus(true);
      }
    });
  }

  return (
    <div>
      {status ? (
        <div>
          <h4 className="sub-heading">Transaction completed succesfully</h4>
          <Link to={`purchase/${query2}`}>
            <Button className="btn-dark ">view receipt</Button>
          </Link>
        </div>
      ) : (
        <Button onClick={verify}>Confirm your Transaction</Button>
      )}
    </div>
  );
}

export default Success;

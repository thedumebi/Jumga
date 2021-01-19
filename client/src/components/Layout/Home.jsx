import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

function Home(props) {
  return (
    <div className="container center">
      {props.loggedIn ? (
        <h1 className="big-heading">Welcome to Jumga E-commerce site.</h1>
      ) : (
        <div>
          <h1>
            Welcome, to the number one E-commerce store. Login or register to
            begin!
          </h1>
          <Link to="/register">
            <Button className="btn btn-lg btn-dark">Register</Button>
          </Link>
          <Link to="/login">
            <Button className="btn btn-lg btn-dark">Login</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Home;

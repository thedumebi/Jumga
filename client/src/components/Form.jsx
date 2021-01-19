import React, { useState } from "react";
import axios from "axios";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { Form, Button, Container, Col } from "react-bootstrap";

function Login(props) {
  const { url } = useRouteMatch();
  const history = useHistory();
  const [register, setRegister] = useState({
    username: "",
    fname: "",
    lname: "",
    password: "",
    cpassword: "",
    phone: "",
    role: "",
    country: "",
  });

  const [login, setLogin] = useState({
    username: "",
    password: "",
    role: "",
  });

  function handleRegister(event) {
    const { name, value } = event.target;
    setRegister((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  function submitRegister() {
    const url = "/api/register";
    axios.post(url, register, { withCredentials: true }).then((res) => {
      if (res.data.status === "success") {
        history.push(
          res.data.user.role === "vendor"
            ? "/vendor"
            : res.data.user.role === "client"
            ? "/client"
            : "/dispatch"
        );
        props.logged(true);
      }
    });
  }

  function handleLogin(event) {
    const { name, value } = event.target;
    setLogin((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  function submitLogin() {
    const url = "/api/login";
    axios
      .post(url, login, { withCredentials: true })
      .then((res) => {
        if (res.data.status === "success") {
          props.user(res.data.user);
          history.push(
            res.data.user.role === "vendor"
              ? "/vendor"
              : res.data.user.role === "client"
              ? "/client"
              : "/dispatch"
          );
          props.logged(true);
        } else {
          history.push("/login");
          alert(res.data.message);
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <div>
      <Container>
        <Form className="form">
          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              onChange={props.isRegistered ? handleLogin : handleRegister}
              name="username"
              type="email"
              placeholder="Enter email"
              value={props.isRegistered ? login.username : register.username}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              onChange={props.isRegistered ? handleLogin : handleRegister}
              name="password"
              type="password"
              placeholder="Password"
              value={props.isRegistered ? login.password : register.password}
            />
          </Form.Group>

          {!props.isRegistered && (
            <div>
              <Form.Group>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  onChange={handleRegister}
                  name="cpassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={register.cpassword}
                />
              </Form.Group>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="John"
                    name="fname"
                    onChange={handleRegister}
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Doe"
                    name="lname"
                    onChange={handleRegister}
                  />
                </Form.Group>
              </Form.Row>
              <Form.Group>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  onChange={handleRegister}
                  name="phone"
                  type="text"
                  placeholder="Phone number"
                  value={register.phone}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Select Your Country</Form.Label>
                <Form.Control
                  as="select"
                  onChange={handleRegister}
                  name="country"
                  value={register.country}
                >
                  <option value="">pick your country ...</option>
                  <option value="NGN">Nigeria</option>
                  <option value="GHS">Ghana</option>
                  <option value="KES">Kenya</option>
                  <option value="GBP">UK</option>
                </Form.Control>
              </Form.Group>
            </div>
          )}
          <Form.Group>
            <Form.Label>Select Your Role</Form.Label>
            <Form.Control
              as="select"
              onChange={props.isRegistered ? handleLogin : handleRegister}
              name="role"
              value={props.isRegistered ? login.role : register.role}
            >
              <option value="">pick a role ...</option>
              <option value="vendor">Vendor</option>
              <option value="client">Client</option>
              <option value="dispatch">Dispatch</option>
            </Form.Control>
          </Form.Group>
          <Button
            className="btn btn-dark btn-lg"
            onClick={props.isRegistered ? submitLogin : submitRegister}
            type="button"
          >
            {props.isRegistered ? "Login" : "Register"}
          </Button>
        </Form>
        {url === "/login" && (
          <p>
            Don't have an account yet?{" "}
            <Link to="/register">
              <Button>Register</Button>
            </Link>
          </p>
        )}
      </Container>
    </div>
  );
}

export default Login;

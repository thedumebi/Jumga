import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import Login from "./Form";
import Home from "./Layout/Home";
import Menu from "./Layout/Navbar";
import axios from "axios";
import Shops from "./Shops";
import Items from "./Items";
import SItem from "./SItem";
import SShop from "./SShop";
import User from "./User";
import Purchase from "./Purchase";
import Logout from "./Logout";
import AddItem from "./AddItem";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:9000/checkAuthentication", {
        withCredentials: true,
      })
      .then((res) => {
        setLoggedIn(res.data.authenticated);
        setUser(res.data.user);
      })
      .catch((error) => {
        setLoggedIn(false);
      });
  }, []);

  function logged(value) {
      setLoggedIn(value);
  }

  return (
    <Router>
      <div>
        <Menu user={user} />
        <Switch>
          <Route exact path="/">
            <Home loggedIn={loggedIn} />
          </Route>
          <Route exact path="/register">
            <Login isRegistered={false} logged={logged} />
          </Route>
          <Route exact path="/login">
            <Login isRegistered={true} logged={logged} />
          </Route>
          <Route exact path="/shops">
            <Shops />
          </Route>
          <Route exact path="/items">
            <Items />
          </Route>
          <Route exact path="/items/:itemId">
            <SItem />
          </Route>
          <Route exact path="/shops/:shopId">
            <SShop user={user} />
          </Route>
          <Route exact path="/purchase/:tx_ref">
            <Purchase />
          </Route>
          <Route exact path="/logout">
            <Logout />
          </Route>
          {user ?
            (user.role === "vendor" ? (
              <div>
                <Route exact path="/vendor">
                  <User user={user} />
                </Route>
                <Route exact path="/vendor/:shopId/additem">
                  <AddItem />
                </Route>
              </div>
            ) : user.role === "client" ? (
              <Route exact path="/client">
                <User user={user} />
              </Route>
            ) : (
              <Route exact path="/dispatch">
                <User user={user} />
              </Route>
            )): <Redirect to="/" />}
        </Switch>
      </div>
    </Router>
  );
}

export default App;

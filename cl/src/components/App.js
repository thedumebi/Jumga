import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import Login from "./Form";
import Home from "./Layout/Home";
import Menu from "./Layout/Navbar";
import Shops from "./Shops";
import Items from "./Items";
import SItem from "./SItem";
import SShop from "./SShop";
import User from "./User";
import Purchase from "./Purchase";
import Logout from "./Logout";
import AddItem from "./AddItem";
import RegisterShop from "./RegisterShop";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  function logged(value) {
    setLoggedIn(value);
  }

  function getUser(value) {
    setUser(value);
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
            <Login isRegistered={false} logged={logged} user={getUser} />
          </Route>
          <Route exact path="/login">
            <Login isRegistered={true} logged={logged} user={getUser} />
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
            <Logout user={getUser} />
          </Route>
          <Route exact path="/registershop">
            <RegisterShop />
          </Route>
          <Route
            exact
            path={user &&
              user.role === "vendor"
                ? "/vendor"
                : user && user.role === "client"
                ? "/client"
                : user && user.role === "dispatch"
                ? "/dispatch"
                : null
            }
          >
            <User user={user} />
          </Route>
          <Route exact path={user && user.role === "vendor" && "/vendor/:shopId/additem"}>
            <AddItem />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from "axios";
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
import BuyItem from "./BuyItem";
import ErrorPage from "./ErrorPage";
import Success from "./Success";
import ShopPayment from "./ShopPayment";
import History from "./History";
import Favorite from "./Favorite";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("/api/checkAuthentication", {
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
            <Shops user={user} />
          </Route>
          <Route exact path="/items">
            <Items user={user} />
          </Route>
          <Route exact path="/items/:itemId">
            <SItem user={user} />
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
          <Route exact path="/success">
            <Success />
          </Route>
          <Route exact path="/shoppayment">
            <ShopPayment />
          </Route>
          <Route exact path="/items/:itemId/buy">
            <BuyItem user={user} />
          </Route>
          {user && (
            <div>
              <Route exact path="/vendor">
                <User user={user} />
              </Route>
              <Route exact path="/vendor/:shopId/additem">
                <AddItem />
              </Route>
              <Route exact path="/client">
                <User user={user} />
              </Route>
              <Route exact path="/dispatch">
                <User user={user} />
              </Route>
              <Route exact path="/registershop">
                <RegisterShop user={user} />
              </Route>
              <Route exact path="/history">
                <History user={user} />
              </Route>
              <Route exact path="/favorites">
                <Favorite user={user} />
              </Route>
            </div>
          )}
          <Route path="/:name">
            <ErrorPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

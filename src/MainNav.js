import React, { useEffect, useState } from "react";
import "./mainnav.css";
import App from "./App";
import Dash2 from "./Dash2"
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
const MainNav = (props) => {
  return (
    <Router>
      <div className='mainpage'>
        <div className='sidebar'>
          <h2>Dashboard people.csv</h2>
          <div className='buttoncontainer'>
            <Link className="boton-ruta" to='/'>Dashboard 1</Link>
            <Link className="boton-ruta" to='/dash2'>Dashboard 2</Link>
          </div>
        </div>
        <div className='container'>
          <Switch>
            <Route path='/dash2'>
            <Dash2 />
            </Route>
            <Route path='/'>
              <App/>
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
};

function a() {
  return (
    <div className='mainpage'>
      <div className='sidebar'>
        <h2>Dashboard people.csv</h2>
        <div className='buttoncontainer'>
          <button>Dashboard 1</button>
          <button>Dashboard 2</button>
        </div>
      </div>
      <div className='container'>
        <App />
      </div>
    </div>
  );
}
export default MainNav;

import * as React from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";

import Overview from "./components/Overview";

import "./App.css";
import "./assets/css/gothamchess.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="*" component={Overview}></Route>
      </Switch>
    </Router>
  );
}

export default App;

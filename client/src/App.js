import * as React from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";

import Navbar from "./components/Navbar";
import Overview from "./components/Overview";
import LearnWithVideo from "./components/LearnWithVideo";

import "./App.css";
import "./assets/css/gothamchess.css";

function App() {
  return (
    <Router>
      <Navbar></Navbar>
      <Switch>
        <Route path="/gothamchess/:id" component={LearnWithVideo}></Route>
        <Route path="*" component={Overview}></Route>
      </Switch>
    </Router>
  );
}

export default App;

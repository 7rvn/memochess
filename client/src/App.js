import * as React from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";

import Navbar from "./components/Navbar";
import Overview from "./components/Overview";
import LearnWithVideo from "./components/LearnWithVideo";
import CustomPgn from "./components/CustomPgn";

import "./App.css";
import "./assets/css/youtube.css";
import LandingPage from "./components/LandingPage";

function App() {
  return (
    <Router>
      <Navbar></Navbar>
      <Switch>
        <Route path="/opening/:id" component={LearnWithVideo}></Route>
        <Route path="/overview/:id" component={Overview}></Route>
        <Route path="/all-openings" component={Overview}></Route>
        <Route path="/custom-pgn" component={CustomPgn}></Route>
        <Route path="/*" component={LandingPage}></Route>
      </Switch>
    </Router>
  );
}

export default App;

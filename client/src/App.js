import React from "react";
import AddressSearch from "./components/AddressSearch";
import Page from "./components/Page";
import "./index.css";
import "antd/dist/antd-red.css";
import About from "./components/About";
import Home from "./components/Home"
import { Router } from "@reach/router";

function App() {
  return (
    <div className={"App"}>
      <Router>
        <Home path="/"/>
        <About path="about" />
      </Router>
    </div>
  );
}
export default App;

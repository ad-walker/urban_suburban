import React from "react";
import "./index.css";
import "antd/dist/antd-red.css";
import Home from "./components/Home"
import About from "./components/About";
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

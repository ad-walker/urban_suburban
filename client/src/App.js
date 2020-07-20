import React from "react";
import "./index.css";
import "antd/dist/antd-red.css";
import Home from "./components/Home"
import FAQ from "./components/FAQ";
import { Router } from "@reach/router";

function App() {
  return (
    <div className={"App"}>
      <Router>
        <Home path="/"/>
        <FAQ path="faq" />
      </Router>
    </div>
  );
}
export default App;

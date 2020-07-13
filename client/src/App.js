import React from "react";
import AddressSearch from "./components/AddressSearch";
import Page from "./components/Page";
import "./index.css";
import "antd/dist/antd-red.css";

function App() {
  return (
    <div className={"App"}>
      <Page>
        <AddressSearch />
      </Page>
    </div>
  );
}
export default App;

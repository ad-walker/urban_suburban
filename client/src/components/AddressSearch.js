import React, { useEffect, useState } from "react";
import { Input } from "antd";
import { withError } from "antd/lib/modal/confirm";
import { useMediaQuery } from "react-responsive";
// Antd object destructuring.
const { Search } = Input;

const AddressSearch = () => {
  const isDesktop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });
  const [testVal, setTestVal] = useState("");

  // 1001020100
  const callApi = async (value) => {
    const response = await fetch("/api/tracts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({geoid: parseInt(value)}),
    });
    
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    console.log(body);
    setTestVal(body[0].geoid);
  };

  return (
    <div
      style={{
        justifyContent: "center",
        alignItems: "center",
        margin: "8% auto",
        display: "float",
      }}
    >
      <div>
        <h1 style={{ fontWeight: "300", display: "inline" }}>Urban or </h1>
        <h1 style={{ fontWeight: "700", display: "inline", color: "#ff4f38" }}>
          Suburban?
        </h1>
      </div>
      <Search
        style={{ width: isDesktop ? "50%" : "100%" }}
        placeholder="Enter an address"
        enterButton="Search"
        size="large"
        onSearch={(value) => callApi(value)}
      />
      <h2>{testVal}</h2>
    </div>
  );
};
/*
const styles = {
  container: isWidescreen => ({
    width: !isWidescreen ? "50%" : "100%",
  })
};
*/

export default AddressSearch;

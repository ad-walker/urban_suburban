import React, {useEffect, useState} from "react";
import { Input } from "antd";
import { withError } from "antd/lib/modal/confirm";
import { useMediaQuery } from 'react-responsive'
// Antd object destructuring.
const { Search } = Input;


const AddressSearch = () => {
  const isDesktop = useMediaQuery({
    query: '(min-device-width: 1224px)'
  })
  const [testVal, setTestVal] = useState("");

  const callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    
    setTestVal(body.express)
  };

  return (
    <div
      style={{
        justifyContent: "center",
        alignItems: "center",
        margin: "8% auto",
        display: "float"
      }}
    >
      <div>
        <h1 style={{ fontWeight: "300", display: "inline" }}>Urban or </h1>
        <h1 style={{ fontWeight: "700", display: "inline", color: "#ff4f38" }}>
          Suburban?
        </h1>
      </div>
      <Search
        style={{width: isDesktop ? "50%" : "100%"}}
        placeholder="Enter an address"
        enterButton="Search"
        size="large"
        onSearch={(value) => callApi()}
      />
      <h2>{testVal}</h2>
    </div>
  );
}
/*
const styles = {
  container: isWidescreen => ({
    width: !isWidescreen ? "50%" : "100%",
  })
};
*/

export default AddressSearch;
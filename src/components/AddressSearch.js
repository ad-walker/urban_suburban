import React, {useEffect, useState} from "react";
import { Input } from "antd";
import { withError } from "antd/lib/modal/confirm";
// Antd object destructuring.
const { Search } = Input;


const AddressSearch = () => {
  const mediaMatch = window.matchMedia('(min-width: 500px)');
  const [wideScreen, setWideScreen] = useState(mediaMatch.matches);
  useEffect(() => {
    const handler = e => setWideScreen(e.matches);
    mediaMatch.addListener(handler);
    console.log(styles.container(wideScreen).width)
    return () => mediaMatch.removeListener(handler);
  });
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
        style={{width: styles.container(wideScreen).width}}
        placeholder="Enter an address"
        enterButton="Search"
        size="large"
        onSearch={(value) => console.log(value)}
      />
    </div>
  );
}
const styles = {
  container: wideScreen => ({
    width: wideScreen ? "50%" : "100%",
  })
};

export default AddressSearch;

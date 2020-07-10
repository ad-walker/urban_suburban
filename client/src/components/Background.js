import React from "react";
import BackgroundImage from "../images/footer_image.svg";

function Background(props) {
  return (
    <div
      style={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: "contain",
        backgroundPosition: "center bottom",
        width: "100%",
        height: "auto",
        minHeight: "100vh",
        backgroundRepeat: "no-repeat",
        backgroundColor: "white"
      }}
    >
      {props.children}
    </div>
  );
}
export default Background;

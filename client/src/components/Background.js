import React from "react";
import BackgroundImage from "../images/footer_image.svg";
function Background(props) {
  return (
    <div
      className="bg-image"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      {props.children}
    </div>
  );
}
export default Background;

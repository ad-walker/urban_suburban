import React from "react";
import UrbanImage from "../images/urban.svg";
import SuburbanImage from "../images/suburban.svg";
import RuralImage from "../images/rural.svg";

function LocationResult(props) {
  const { data } = props;
  // Use the classification field tacked on after the query to display
  // the correct image.
  let imgSrc = "";
  switch (data.classification.toLowerCase()) {
    case "urban":
      imgSrc = UrbanImage;
      break;
    case "suburban":
      imgSrc = SuburbanImage;
      break;
    case "rural":
      imgSrc = RuralImage;
      break;
    default:
      imgSrc = SuburbanImage;
      break;
  }
  return (
    <>
      <img src={imgSrc} style={{ borderRadius: "100%" }} />
      <div style={{ textAlign: "center" }}>
        <h1 style={{ color: "#545454" }}>
          <b>{data.classification}!</b>
        </h1>
        <span>
          <h3>
            Here's how your community classified itself when surveyed:
            <br />
            <span style={{ color: "#ff4f38" }}>
              <b>Urban:</b>
            </span>{" "}
            {(data[0].upsai_urban * 100).toFixed(2)}%{" "}
            <span style={{ color: "#ff4f38" }}>
              <b>Suburban:</b>
            </span>{" "}
            {(data[0].upsai_suburban * 100).toFixed(2)}%{" "}
            <span style={{ color: "#ff4f38" }}>
              <b>Rural:</b>
            </span>{" "}
            {(data[0].upsai_rural * 100).toFixed(2)}%
          </h3>
        </span>
      </div>
    </>
  );
}

export default LocationResult;

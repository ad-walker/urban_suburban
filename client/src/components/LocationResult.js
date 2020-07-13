import React from "react";
import UrbanImage from "../images/urban.svg";
import SuburbanImage from "../images/suburban.svg";
import RuralImage from "../images/rural.svg";
import UnknownImage from "../images/unknown.svg";
import { Statistic, Card, Row, Col } from "antd";
import { censusAPI } from "../api";

function LocationResult(props) {
  const { data } = props;
  // Enum to access the images easily.
  const images = {
    URBAN: UrbanImage,
    SUBURBAN: SuburbanImage,
    RURAL: RuralImage,
    UNKNOWN: UnknownImage,
  };
  // Push all of the data into an array for ease of sorting in descending order.
  const results = [];
  results.push({
    class: "Urban",
    percentage: data[0].upsai_urban * 100,
    image: images.URBAN,
  });
  results.push({
    class: "Suburban",
    percentage: data[0].upsai_suburban * 100,
    image: images.SUBURBAN,
  });
  results.push({
    class: "Rural",
    percentage: data[0].upsai_rural * 100,
    image: images.RURAL,
  });
  // prettier-ignore
  // Sort Descending
  results.sort((a, b) => { return b.percentage - a.percentage;});
  const classification = results[0];

  if (classification.percentage == 0.0) classification.class = "Unknown";

  // Create the stat cards based on the array elements.
  const stats = results.map((element, index) => (
    <Card>
      <Statistic
        title={element.class}
        value={element.percentage}
        precision={2}
        valueStyle={index === 0 ? { color: "#3f8600" } : { color: "#000000" }}
        suffix="%"
      />
    </Card>
  ));

  const description =
    classification.class == "Unknown" ? (
      <h3 className="description">
        Hmm, doesn't look like we have any information for that address. The HUD
        data is based on a 2017 survey, so if your address is newer it may not
        have been included.
      </h3>
    ) : (
      <h3 className="description">
        Based on{" "}
        <a href="https://www.huduser.gov/portal/AHS-neighborhood-description-study-2017.html#small-area-tab">
          HUD's model
        </a>
        , here's how likely the average household is to classify this
        neighborhood:
      </h3>
    );

  const censusLink = "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=" + data.address_string + "&benchmark=4&vintage=417"
  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ color: "#545454" }}>
          <b>{classification.class}!</b>
        </h1>
        <span style={{ textAlign: "left" }}>{description}</span>
        <div className="site-statistic-demo-card">
          <Row gutter={4} style={{ alignItems: "center" }}>
            <Col span={8}>{stats}</Col>
            <Col span={16}>
              <img
                src={
                  classification.class != "Unknown"
                    ? results[0].image
                    : images.UNKNOWN
                }
                style={{ borderRadius: "100%" }}
              />
            </Col>
          </Row>
        </div>
        <Card title="Additional Data" bordered={false} style={{alignItems:"center"}}>
          <Row gutter={16}>
            <Col span={12}>
              <Statistic
                title="Geo Id"
                value={data[0].geoid}
                formatter={value => value}
              />
            </Col>
            <Col span={12}>
              <Statistic title="Tract" value={data[0].tract} formatter={value => value}/>
            </Col>
            <Col span={12}>
              <Statistic title="Est. Occupied Households" value={data[0].occupied_housing_units_est} formatter={value => value}/>
            </Col>
            <Col span={12}>
              <Statistic title="Census Geocoder" value={<a href={censusLink} target="_blank">Link</a>} formatter={value => value}/>
            </Col>
          </Row>
        </Card>
      </div>
    </>
  );
}

export default LocationResult;

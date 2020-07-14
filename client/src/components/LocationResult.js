import React from "react";
import UrbanImage from "../images/urban.svg";
import SuburbanImage from "../images/suburban.svg";
import RuralImage from "../images/rural.svg";
import UnknownImage from "../images/unknown.svg";
import { Statistic, Card, Row, Col } from "antd";
import MediaQuery from "react-responsive";

function LocationResult(props) {
  let { data } = props;
  data = data[0];
  // Enum to access the images easily.
  const images = {
    URBAN: UrbanImage,
    SUBURBAN: SuburbanImage,
    RURAL: RuralImage,
    UNKNOWN: UnknownImage,
  };
  // Put everything into an array for ease of sorting based on results.
  const results = [
    {
      class: "Urban",
      percentage: data.upsai_urban * 100,
      image: images.URBAN,
    },
    {
      class: "Suburban",
      percentage: data.upsai_suburban * 100,
      image: images.SUBURBAN,
    },
    {
      class: "Rural",
      percentage: data.upsai_rural * 100,
      image: images.RURAL,
    },
  ];

  // prettier-ignore
  // Sort Descending
  results.sort((a, b) => { return b.percentage - a.percentage;});
  const classification = results[0];

  // If we couldn't find model data set classification to unknown.
  if (classification.percentage == 0.0) classification.class = "Unknown";

  // Create the stats based on the array elements.
  const stats = results.map((element, index) => (
    <Col span={8} key={index}>
      <Statistic
        title={element.class}
        value={element.percentage}
        precision={2}
        valueStyle={index === 0 ? { color: "#3f8600" } : { color: "#000000" }}
        suffix="%"
      />
    </Col>
  ));

  const description =
    classification.class == "Unknown" ? (
      <h3 className="description">
        Hmm, doesn't look like we have any information for that address. The HUD
        model is based on 2017 data, so if your address is newer it may not have
        been included.
      </h3>
    ) : (
      <h3 className="description">
        Based on{" "}
        <a href="https://www.huduser.gov/portal/AHS-neighborhood-description-study-2017.html#small-area-tab">
          HUD's model
        </a>
        , the average household in this neighborhood would most likely describe
        it as <b>{classification.class.toLowerCase()}</b>.
      </h3>
    );

  const censusLink =
    "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=" +
    data.address_string +
    "&benchmark=4&vintage=417";

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ color: "#545454" }}>
          <b>{classification.class}</b>
        </h1>
        <span style={{ textAlign: "left" }}>{description}</span>
        <div className="site-statistic-demo-card">
          <div style={{ alignItems: "center" }}>
            <Row justify="center" gutter={[0, 24]}>
              <Col span={16} style={{ alignItems: "center" }}>
                <img
                  src={
                    classification.class != "Unknown"
                      ? classification.image
                      : images.UNKNOWN
                  }
                  style={{ borderRadius: "100%" }}
                />
              </Col>
            </Row>
            <Row>{stats}</Row>
          </div>
        </div>
        {/* Desktop viewers get extra info. */}
        <MediaQuery minDeviceWidth={1224}>
          <Card
            title="Census Data"
            bordered={false}
            style={{ alignItems: "center" }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Est. Occupied Households"
                  value={data.occupied_housing_units_est}
                  formatter={(value) => value}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Tract"
                  value={data.tract}
                  formatter={(value) => value}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Geo Id"
                  value={data.geoid}
                  formatter={(value) => value}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Census Geocoder"
                  value={
                    <a href={censusLink} target="_blank">
                      Link
                    </a>
                  }
                  formatter={(value) => value}
                />
              </Col>
            </Row>
          </Card>
        </MediaQuery>
      </div>
    </>
  );
}

export default LocationResult;

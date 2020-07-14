import React from "react";
import AddressSearch from "./AddressSearch";
import Page from "./Page";

function Home() {
  // prettier-ignore
  return (
    <Page>
      <div className="call-to-action">
        <span>
          <h1 className="title-urban">Urban or </h1>
          <h1 className="title-suburban">Suburban?</h1>
        </span>
        <div>
          <h5 style={{ fontWeight: "200" }}>
            <span style={{ fontWeight: "400" }}>City dweller</span> or{" "}
            <span className="text-red-em">suburbanite</span>? Find out where you fit based on a{" "}
            <span className="text-red-em">
              <a href="https://www.huduser.gov/portal/AHS-neighborhood-description-study-2017.html#overview-tab" target="_blank">
                HUD study
              </a>
            </span>
            .
          </h5>
        </div>
      </div>
      <AddressSearch />
    </Page>
  );
}

export default Home;

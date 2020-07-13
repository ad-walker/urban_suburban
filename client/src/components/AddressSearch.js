import React, { useState } from "react";
import LocationResult from "./LocationResult";
import { Input, Button, Spin, Modal } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import PlacesAutocomplete from "react-places-autocomplete";
import { geocodeByAddress } from "react-places-autocomplete";
import { useMediaQuery } from "react-responsive";
import { censusAPI, queryOnGeoId } from "../api";

// Import React Scrit Libraray to load Google object
import Script from "react-load-script";

const AddressSearch = () => {
  const [addressString, setAddressString] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [queryObj, setQueryObj] = useState(null);
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [queryResults, setQueryResults] = useState({});
  const isDesktop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });
  const handleChange = (address) => {
    // Rely on selection from the suggestion list,
    // be it via click or keyboard selection to enable
    // search.
    setSearchEnabled(false)
    setAddressString(address);
  };

  const handleButtonClick = async () => {
    if (!searchEnabled) return;
    setIsLoading(true);
    // Query the census endpoint and append a classification
    // to the object for use by the modal.
    censusAPI(queryObj)
      .then((id) => queryOnGeoId(id))
      .then((response) => {
        let classification = "";
        switch (response[0].upsai_cat_controlled) {
          case 1:
            classification = "Urban";
            break;
          case 2:
            classification = "Suburban";
            break;
          case 3:
            classification = "Rural";
            break;
          default:
            classification = "Unknown";
            break;
        }
        response.classification = classification;
        // Set a whole mess o' state.
        setQueryResults(response);
        setIsLoading(false);
        setModalIsVisible(true);
      });
  };

  const handleSelect = (address) => {
    setAddressString(address);
    geocodeByAddress(address)
      .then((results) => {
        console.log(results);
        let censusQuery = { benchmark: 4, vintage: 417, format: "json" };
        for (let i = 0; i < results[0].address_components.length; i++) {
          // prettier-ignore
          for (let j = 0; j < results[0].address_components[i].types.length; j++) {
            switch (results[0].address_components[i].types[j]) {
              case "street_number":
                censusQuery.street = results[0].address_components[i].short_name;
                break;
              case "route":
                censusQuery.street += " " + results[0].address_components[i].short_name;
                break;
              case "locality":
                censusQuery.city = results[0].address_components[i].short_name;
                break;
              case "administrative_area_level_1":
                censusQuery.state = results[0].address_components[i].short_name;
                break;
              case "postal_code":
                censusQuery.zip = results[0].address_components[i].short_name;
                break;
              default:
                break;
            }
          }
        }
        setQueryObj(censusQuery);
        setSearchEnabled(true);
      })
      .catch((error) => console.error("Error", error));
  };

  const onScriptLoad = () => {
    // Do intialization stuff here, if'n that's your thing.
  };

  return (
    <div
      style={{
        justifyContent: "center",
        textAlign: "center",
        alignItems: "center",
        margin: "8% 0 0 0",
        display: "float",
      }}
    >
      <Script
        url={
          "https://maps.googleapis.com/maps/api/js?key=" +
          process.env.REACT_APP_GKEY +
          "&libraries=places&callback=onScriptLoad"
        }
        onLoad={onScriptLoad}
      />
      <div>
        <h1 style={{ fontWeight: "300", display: "inline", fontSize: "2.0em" }}>
          Urban or{" "}
        </h1>
        <h1
          style={{
            fontWeight: "700",
            display: "inline",
            color: "#ff4f38",
            fontSize: "2.0em",
          }}
        >
          Suburban?
        </h1>
      </div>
      <div
        style={{ width: isDesktop ? "50%" : "90%", display: "inline-block" }}
      >
        <h5 style={{ display: "inline-block", fontWeight: "200" }}>
          <span style={{ fontWeight: "400" }}>City dweller</span> or{" "}
          <span style={{ color: "#ff4f38", fontWeight: "400" }}>
            suburbanite
          </span>
          ? Find out where your neighborhood fits from people in your community,
          based on{" "}
          <span style={{ fontWeight: "400", color: "ff4f38" }}>
            <a
              href="https://www.huduser.gov/portal/AHS-neighborhood-description-study-2017.html#overview-tab"
              target="_blank"
            >
              HUD’s American Housing Survey
            </a>
          </span>
          .
        </h5>
      </div>
      <Spin spinning={isLoading}>
        <PlacesAutocomplete
          value={addressString}
          onChange={handleChange}
          onSelect={handleSelect}
          googleCallbackName="onScriptLoad"
          searchOptions={{
            types: ["address"],
            componentRestrictions: { country: "us" },
          }}
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading,
          }) => (
            <div style={{ width: "100vw" }}>
              <div>
                <Input
                  style={{ width: isDesktop ? "50%" : "75%" }}
                  size="large"
                  {...getInputProps({
                    placeholder: "Enter an address...",
                    className: "location-search-input",
                  })}
                  onPressEnter={handleButtonClick}
                  allowClear="true"
                />
                <Button
                  type="danger"
                  shape="square"
                  size="large"
                  icon={<SearchOutlined />}
                  disabled={!searchEnabled}
                  onClick={handleButtonClick}
                />
              </div>
              <div
                className="autocomplete-dropdown-container"
                style={{
                  display: "inline-block",
                  width: isDesktop ? "52.5%" : "90%",
                }}
              >
                {loading && <div>Loading...</div>}
                {suggestions.map((suggestion) => {
                  const className = suggestion.active
                    ? "suggestion-item--active"
                    : "suggestion-item";
                    const style = suggestion.active
                    ? { backgroundColor: '#cccccc', cursor: 'pointer' }
                    : { backgroundColor: 'rgba(237,237,237,.25)', cursor: 'pointer' };
                  return (
                    <div style={{borderRadius: "4px"}}
                      key="0"
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style,
                      })}
                    >
                      <span style={{color: "#333333"}}>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>

        <Modal
          footer={null}
          style={{ top: isDesktop ? 20 : 0 }}
          title={"Survey Results"}
          visible={modalIsVisible}
          onCancel={() => setModalIsVisible(false)}
        >
          <LocationResult data={queryResults} />
        </Modal>
      </Spin>
    </div>
  );
};

export default AddressSearch;

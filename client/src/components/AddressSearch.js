import React, { useState } from "react";
import LocationResult from "./LocationResult";
import { Input, Button, Spin, Modal, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import PlacesAutocomplete from "react-places-autocomplete";
import { geocodeByAddress } from "react-places-autocomplete";
import { useMediaQuery } from "react-responsive";
import { censusAPI, queryOnGeoId, formatCensusAddress } from "../api";
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
    setSearchEnabled(false);
    setAddressString(address);
  };

  const handleButtonClick = async () => {
    if (!searchEnabled) return;
    setIsLoading(true);
    // Query the census endpoint and append a classification
    // to the object for use by the modal.
    try {
      await censusAPI(queryObj)
        .then(async (id) => await queryOnGeoId(id))
        .then((response) => {
          response.address_string = addressString;
          // Set a whole mess o' state.
          setQueryResults(response);
          setIsLoading(false);
          setModalIsVisible(true);
        });
    } catch {
      message.error(
        "Something went wrong. Don't worry, it's probably not your fault..."
      );
      setIsLoading(false);
    }
  };

  const handleSelect = (address) => {
    setAddressString(address);
    geocodeByAddress(address)
      .then((googleAddressObj) => {
        // Create the query object and hard code these values because
        // it's the dataset the study is based on.
        let censusQuery = { benchmark: 4, vintage: 417, format: "json" };
        // Google returns a nice formatted_address string that would be perfect except it occassionally
        // includes a "premise" from the places API. Just to be safe, we'll build our own address
        // string from the individual address_components.
        // prettier-ignore
        censusQuery.address = formatCensusAddress(googleAddressObj[0].address_components);
        if (censusQuery.address == null) {
          // prettier-ignore
          message.error("Valid street address required, e.g. 6925 Hollywood Blvd");
          return;
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
    <div className="address-search-container">
      <Script
        url={
          "https://maps.googleapis.com/maps/api/js?key=" +
          process.env.REACT_APP_GKEY +
          "&libraries=places&callback=onScriptLoad"
        }
        onLoad={onScriptLoad}
      />
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
            <div>
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
                    ? { backgroundColor: "#cccccc", cursor: "pointer" }
                    : {
                        backgroundColor: "rgba(237,237,237,.25)",
                        cursor: "pointer",
                      };
                  return (
                    <div
                      key="0"
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style,
                      })}
                    >
                      <span style={{ color: "#333333" }}>
                        {suggestion.description}
                      </span>
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

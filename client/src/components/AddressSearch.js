import React, { useState } from "react";
import { Input, Button, Spin } from "antd";
import PlacesAutocomplete from "react-places-autocomplete";
import { SearchOutlined } from "@ant-design/icons";
import { geocodeByAddress } from "react-places-autocomplete";
import { useMediaQuery } from "react-responsive";
import { createRequestSignature } from "../helpers";

// Import React Scrit Libraray to load Google object
import Script from "react-load-script";

const AddressSearch = () => {
  const isDesktop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });
  const [testVal, setTestVal] = useState("");
  const [address, setAddress] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [queryObj, setQueryObj] = useState({});
  const [searchEnabled, setSearchEnabled] = useState(false);

  // 1001020100
  const queryDB = async (value) => {
    const reqBody = JSON.stringify({ geoid: parseInt(value) });
    const signature = createRequestSignature(reqBody);
    const response = await fetch("/api/geoid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Signature: signature,
      },
      body: reqBody,
    });

    const result = await response.json();
    if (response.status !== 200) throw Error(result.message);
    console.log(result);
    let classification = "";
    switch (result[0].upsai_cat_controlled) {
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
    setTestVal(classification);
    setIsLoading(false);
  };

  const censusAPI = async () => {
    setIsLoading(true);
    var url = new URL(
      "https://geocoding.geo.census.gov/geocoder/geographies/address"
    );
    Object.keys(queryObj).forEach((key) =>
      url.searchParams.append(key, queryObj[key])
    );

    let reqBody = JSON.stringify({ url: url });
    let signature = createRequestSignature(reqBody);

    fetch("/api/address", {
      method: "POST",
      headers: { "Content-Type": "application/json", Signature: signature },
      body: reqBody,
    })
      .then((response) => response.json())
      .then((json) => {
        queryDB(json.id);
      });
  };

  const handleChange = (address) => {
    setAddress(address);
  };

  const handleSelect = (address) => {
    setAddress(address);
    setTestVal("");

    geocodeByAddress(address)
      .then((results) => {
        console.log(results);
        let censusQuery = {benchmark: 4, vintage: 417, format: "json"};
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
        <h1 style={{ fontWeight: "300", display: "inline" }}>Urban or </h1>
        <h1 style={{ fontWeight: "700", display: "inline", color: "#ff4f38" }}>
          Suburban?
        </h1>
      </div>
      <Spin spinning={isLoading}>
        <PlacesAutocomplete
          value={address}
          onChange={handleChange}
          onSelect={handleSelect}
          onError={()=>setTestVal("Error")}
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
              <Input
                style={{ width: isDesktop ? "50%" : "75%" }}
                size="large"
                allowClear="true"
                {...getInputProps({
                  placeholder: "Enter an address...",
                  className: "location-search-input",
                })}
              />
              <Button
                type="danger"
                shape="square"
                size="large"
                icon={<SearchOutlined />}
                disabled={!searchEnabled}
                onClick={censusAPI}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map((suggestion) => {
                  const className = suggestion.active
                    ? "suggestion-item--active"
                    : "suggestion-item";
                  // inline style for demonstration purpose

                  const style = {
                    backgroundColor: "rgba(255,255,255,0.5)",
                    cursor: "pointer",
                  };
                  //: { backgroundColor: "#ffffff", cursor: "pointer" };//suggestion.active
                  // ? { backgroundColor: "#ff2e4a", cursor: "pointer" }
                  //: { backgroundColor: "#ffffff", cursor: "pointer" };
                  return (
                    <div key='0'
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style,
                      })}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
      </Spin>
      <h2>{testVal}</h2>
    </div>
  );
};
/*
const styles = {
  container: isWidescreen => ({
    width: !isWidescreen ? "50%" : "100%",
  })
};
*/

export default AddressSearch;

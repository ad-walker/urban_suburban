import { createHmac } from "crypto";
export const censusAPI = async (query) => {
  return new Promise((resolve, reject) => {
    // Build the query string from values parsed by Google.
    var url = new URL(
      // Changed to one line address query based on testing, 321 Avenue F, Pittsburgh, PA, USA would not
      // resolve with full address but would resolve to one street over with one line address.
      "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress"
    );
    Object.keys(query).forEach((key) =>
      url.searchParams.append(key, query[key])
    );
    // Generate HMAC signature for endpoint.
    let reqBody = JSON.stringify({ url: url });
    let signature = createRequestSignature(reqBody);

    try {
      fetch("/api/address", {
        method: "POST",
        headers: { "Content-Type": "application/json", Signature: signature },
        body: reqBody,
      })
        .then((response) => response.json())
        .then((json) => {
          resolve(json.id);
        });
    } catch (err) {
      reject(err);
    }
  });
};

export const queryOnGeoId = async (id) => {
  return new Promise((resolve, reject) => {
    const reqBody = JSON.stringify({ geoid: parseInt(id) });
    const signature = createRequestSignature(reqBody);
    try {
      fetch("/api/geoid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Signature: signature,
        },
        body: reqBody,
      })
        .then((response) => response.json())
        .then((json) => {
          resolve(json);
        });
    } catch (err) {
      reject(err);
    }
  });
};

export const formatCensusAddress = (address_components) => {
  let address = {};
  // Loop over the values returned by storing only the component types we
  // explicitly need.
  for (let i = 0; i < address_components.length; i++) {
    // prettier-ignore
    for (let j = 0; j < address_components[i].types.length; j++) {
      switch (address_components[i].types[j]) {
        case "street_number":
          address.street = address_components[i].short_name;
          break;
        case "route":
          address.street += " " + address_components[i].short_name;
          break;
        case "locality":
          address.city = address_components[i].short_name;
          break;
        case "administrative_area_level_1":
          address.state = address_components[i].short_name;
          break;
        case "postal_code":
          address.zip = address_components[i].short_name;
          break;
        default:
          break;
      }
    }
  }

  // Confirm our new address object got all of the components we need from the loop.
  if (
    !("street" in address) &&
    !("city" in address) &&
    !("state" in address) &&
    !("zip" in address)
  )
    return null;
  // Require a house number since the maps API will autocomplete just street names.
  else if (address.street.includes("undefined")) return null;
  // Build and return the string.
  return (
    address.street +
    " " +
    address.city +
    " " +
    address.state +
    " " +
    address.zip
  );
};

const createRequestSignature = (req) => {
  const hmac = createHmac("sha256", process.env.REACT_APP_SIGNING_SECRET);
  return hmac.update(req).digest("hex");
};

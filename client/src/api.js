import { createHmac } from "crypto";
export const censusAPI = async (query) => {
  return new Promise((resolve, reject) => {
    // Build the query string from values parsed by Google.
    var url = new URL(
      "https://geocoding.geo.census.gov/geocoder/geographies/address"
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
        headers: { "Content-Type": "application/json", 'Signature': signature },
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

const createRequestSignature = (req) => {
  const hmac = createHmac("sha256", process.env.REACT_APP_SIGNING_SECRET);
  return hmac.update(req).digest("hex");
};

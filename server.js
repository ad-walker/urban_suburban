"use strict";
const process = require("process");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const Knex = require("knex");
const fetch = require("node-fetch");
const app = express();
app.enable("trust proxy");
// GAE uses app.yaml, for dev we'll juse use the .env file.
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// Expect json in our request body.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Knex configuration from Google's docs:
// https://github.com/GoogleCloudPlatform/nodejs-docs-samples/blob/master/cloud-sql/postgres/knex/server.js

// [START cloud_sql_postgres_knex_create_tcp]
const connectWithTcp = (config) => {
  // Extract host and port from socket address
  const dbSocketAddr = process.env.DB_HOST.split(":"); // e.g. '127.0.0.1:5432'

  // Establish a connection to the postgres db
  return Knex({
    client: "pg",
    connection: {
      user: process.env.DB_USER, // e.g. 'my-user'
      password: process.env.DB_PASS, // e.g. 'my-user-password'
      database: process.env.DB_NAME, // e.g. 'my-database'
      host: dbSocketAddr[0], // e.g. '127.0.0.1'
      port: dbSocketAddr[1], // e.g. '5432'
    },
    // ... Specify additional properties here.
    ...config,
  });
};
// [END cloud_sql_postgres_knex_create_tcp]

// [START cloud_sql_postgres_knex_create_socket]
const connectWithUnixSockets = (config) => {
  const dbSocketPath = process.env.DB_SOCKET_PATH || "/cloudsql";
  // Establish a connection to the postgres db
  return Knex({
    client: "pg",
    connection: {
      user: process.env.DB_USER, // e.g. 'my-user'
      password: process.env.DB_PASS, // e.g. 'my-user-password'
      database: process.env.DB_NAME, // e.g. 'my-database'
      host: `${dbSocketPath}/${process.env.INSTANCE_CONNECTION_NAME}`,
    },
    // ... Specify additional properties here.
    ...config,
  });
};
// [END cloud_sql_postgres_knex_create_socket]

// Initialize Knex, a Node.js SQL query builder library with built-in connection pooling.
const connect = () => {
  // Configure which instance and what database user to connect with.
  // Remember - storing secrets in plaintext is potentially unsafe. Consider using
  // something like https://cloud.google.com/kms/ to help keep secrets secret.
  let config = { pool: {} };

  // [START cloud_sql_postgres_knex_limit]
  // 'max' limits the total number of concurrent connections this pool will keep. Ideal
  // values for this setting are highly variable on app design, infrastructure, and database.
  config.pool.max = 5;
  // 'min' is the minimum number of idle connections Knex maintains in the pool.
  // Additional connections will be established to meet this value unless the pool is full.
  config.pool.min = 5;
  // [END cloud_sql_postgres_knex_limit]

  // [START cloud_sql_postgres_knex_timeout]
  // 'acquireTimeoutMillis' is the number of milliseconds before a timeout occurs when acquiring a
  // connection from the pool. This is slightly different from connectionTimeout, because acquiring
  // a pool connection does not always involve making a new connection, and may include multiple retries.
  // when making a connection
  config.pool.acquireTimeoutMillis = 60000; // 60 seconds
  // 'createTimeoutMillis` is the maximum number of milliseconds to wait trying to establish an
  // initial connection before retrying.
  // After acquireTimeoutMillis has passed, a timeout exception will be thrown.
  config.createTimeoutMillis = 30000; // 30 seconds
  // 'idleTimeoutMillis' is the number of milliseconds a connection must sit idle in the pool
  // and not be checked out before it is automatically closed.
  config.idleTimeoutMillis = 600000; // 10 minutes
  // [END cloud_sql_postgres_knex_timeout]

  // [START cloud_sql_postgres_knex_backoff]
  // 'knex' uses a built-in retry strategy which does not implement backoff.
  // 'createRetryIntervalMillis' is how long to idle after failed connection creation before trying again
  config.createRetryIntervalMillis = 200; // 0.2 seconds
  // [END cloud_sql_postgres_knex_backoff]

  let knex;
  if (process.env.DB_HOST) {
    knex = connectWithTcp(config);
  } else {
    knex = connectWithUnixSockets(config);
  }
  return knex;
};

const knex = connect();

app.post("/api/geoid", async (req, res) => {
  if (!verifySignature(req)) {
    res.status(500);
    return;
  }
  try {
    let result = await knex
      .select("*")
      .from("tracts")
      .where("geoid", req.body.geoid)
      .limit(1)
      .timeout(5000);
    // Knex throws its own error
    res.status(200).json(result);
  } catch (error) {
    res.status(500);
  }
});

app.post("/api/address", async (req, res) => {
  if (!verifySignature(req)) {
    res.status(500);
    return;
  }

  try {
    await fetch(req.body.url)
      .then((res) => {
        if (res.status != 200) throw Error(res.statusText);
        return res.json();
      })
      .then((json) => {
        // Default to -1 in case we can't find a value, our DB uses this key
        // as an error entry.
        let result = { id: -1 };
        // prettier-ignore
        if (json.result.addressMatches.length > 0)
          result.id = json.result.addressMatches[0].geographies["Census Tracts"][0].GEOID;
        // Return the query result or the error case.
        res.status(200).json(result);
      });
  } catch {
    res.status(500);
  }
});

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "/client/build")));
  // Return all requests to React app for client-side routing.
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "/client/build/index.html"));
  });
}

// GAE defaults to port 8080.
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

// Basic HMAC signing for requests.
const verifySignature = (req) => {
  const crypto = require("crypto");
  const rawString = JSON.stringify(req.body);
  // prettier-ignore
  const hmac = crypto.createHmac("sha256",process.env.REACT_APP_SIGNING_SECRET);
  return hmac.update(rawString).digest("hex") === req.headers.signature;
};

module.exports = server;

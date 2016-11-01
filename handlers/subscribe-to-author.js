'use strict';

const async = require('async');
const Promise = require('bluebird');

const db = require('../database/dynamodb');
const validate = require('../helpers/validation');
const schemas = require('../database/schemas');

const DB_PREFIX = process.env.REMOTE_STAGE;


function createTableIfRequired() {
  // Check to see if we already have a 'users' table.
  return db('listTables')
    .then(tableNames => {
      console.log("\n\nTABLE NAMES", tableNames);
      tableNames.indexOf('Users') !== -1
    })
    .then(hasTable => {
      if (hasTable) {
        return;
      }

      return db('createTable', schemas.users);
    });
}

module.exports = (event, context, callback) => {
  // Validate that we received all necessary information.
  console.log("BODY", event.body);
  if (!event.body) {
    const response = {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
      },
      body: JSON.stringify({
        error: 'No body supplied',
        input: event,
      }),
    };

    callback(null, response);
    return;
  }
  const body = typeof event.body === 'string'
    ? JSON.parse(event.body)
    : event.body;

  validate.subscription(body)
    .then(createTableIfRequired)
    .then(result => {
      console.log("RESULT", result)
      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
        },
        body: JSON.stringify({
          message: 'Go Serverless v1.0! GET listUsers!',
          input: event,
        }),
      };

      callback(null, response);
    })
    .catch(err => {
      console.log("ERROR", err);

      const response = {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
        },
        body: JSON.stringify(err),
      };

      callback(null, response);
    });
};

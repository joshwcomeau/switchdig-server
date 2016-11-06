'use strict';

const async = require('async');
const Promise = require('bluebird');
const AWS = require('aws-sdk');
const uuid = require('node-uuid');

const respond = require('../helpers/respond');

const dynamo = new AWS.DynamoDB.DocumentClient();

const DB_PREFIX = process.env.REMOTE_STAGE;
const TABLE_NAME = 'Users';

function getUser(email, callback) {
  return dynamo.scan({
    TableName: TABLE_NAME,
    FilterExpression: 'email = :email',
    ExpressionAttributeValues: { ':email': email }
  }, callback)
}

function createUser(params, callback) {
  return dynamo.put({
    TableName: TABLE_NAME,
    Item: Object.assign({ id: uuid.v4() }, params),
  }, callback)
}

module.exports = (event, context, callback) => {
  // TODO: Validate that we received all necessary information.

  if (!event.body) {
    return callback(null, respond(500, { msg: 'No body supplied' }));
  }

  const body = typeof event.body === 'string'
    ? JSON.parse(event.body)
    : event.body;

  async.autoInject({
    checkForUser(next) {
      getUser(body.email, next);
    },
    createUser(checkForUser, next) {
      if (checkForUser.Count > 0) {
        return next();
      }

      createUser(body, next)
    },
    user(checkForUser, createUser, next) {
      const user = checkForUser.Items[0] || createUser;

      return next(null, user);
    },
  }, (err, results) => {
    callback(err, respond(200, results))
  });
};

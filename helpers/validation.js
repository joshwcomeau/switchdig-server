const validator = require('node-validator');
const Promise = require('bluebird');


// Custom validators
function isValidNotificationMethod(value, onError) {
  // For now, only email notification is supported.
  if (value !== 'email') {
    onError(
      'Please supply a valid notification method (email)',
      'notificationMethod',
      value
    );
  }
}

module.exports.subscription = (body) => {
  const check = validator
    .isObject()
    .withRequired('author', validator.isString())
    .withRequired('mediaTypes', validator.isArray())
    .withRequired('mediaTypes', validator.isString());

  return Promise.fromCallback(cb => validator.run(check, body, cb));
}

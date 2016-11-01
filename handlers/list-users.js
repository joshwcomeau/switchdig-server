const search = require('../helpers/product-advertising-api').search;

module.exports = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
    },
    body: JSON.stringify({
      success: true,
      input: event,
    }),
  };

  callback(null, response);
};

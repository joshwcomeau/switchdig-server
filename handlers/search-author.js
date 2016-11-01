const search = require('../helpers/product-advertising-api').search;

module.exports = (event, context, callback) => {
  search({ author: event.queryStringParameters.author })
    .then(result => {
      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
        },
        body: JSON.stringify({
          aws_result: result,
          input: event,
        }),
      };

      callback(null, response);
    })
    .catch(error => {
      callback(null, {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
        },
        body: JSON.stringify({
          error: error,
        }),
      });
    });
};

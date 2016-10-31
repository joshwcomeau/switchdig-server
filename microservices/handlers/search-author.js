const search = require('../helpers/product-advertising-api').search;

module.exports = (event, context, callback) => {
  search({ author: 'Jim Butcher' })
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
    })
    .catch(error => {
      callback(error);
    })

  callback(null, response);
};

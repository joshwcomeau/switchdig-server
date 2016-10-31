module.exports = (event, context, callback) => {
  // Validate that we received all necessary information.
  const body = JSON.parse(event.body);

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
};

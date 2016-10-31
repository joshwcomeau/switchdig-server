module.exports = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
    },
    body: JSON.stringify({
      message: 'Go Serverless v1.0! GET searchAuthor!',
      input: event,
    }),
  };

  callback(null, response);
};

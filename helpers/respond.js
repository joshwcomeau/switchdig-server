module.exports = (statusCode, body) => {
  return {
    statusCode,
    body: JSON.stringify(body),
    headers: {
      "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
    },
  }
}

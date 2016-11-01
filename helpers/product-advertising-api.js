const amazon = require('amazon-product-api');

var client = amazon.createClient({
  awsId: process.env.AWS_KEY,
  awsSecret: process.env.AWS_SECRET,
  awsTag: process.env.ASSOCIATE_TAG,
});

module.exports.search = (metadata, searchIndex, responseGroup) => {
  if (typeof searchIndex === 'undefined') {
    searchIndex = 'Books';
  }

  if (typeof responseGroup === 'undefined') {
    responseGroup = 'Images,ItemAttributes,Offers';
  }

  const params = Object.assign({ searchIndex, responseGroup }, metadata);

  // Returns a promise that must be handled by the invoking function.
  return client.itemSearch(params);
}

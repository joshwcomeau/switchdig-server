'use strict';

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

module.exports.getBindingFromMediaTypes = (mediaTypes) => {
  let bindings = [];

  if (mediaTypes.print) {
    bindings.push('hardcover', 'paperback');
  }

  if (mediaTypes.ebook) {
    bindings.push('kindle');
  }

  if (mediaTypes.audiobook) {
    bindings.push('audible');
  }

  const bindingValue = bindings.join(' or ');

  return `binding:${bindingValue}`;
}

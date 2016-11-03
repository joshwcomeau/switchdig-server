const _ = require('lodash');

const search = require('../helpers/product-advertising-api').search;
const respond = require('../helpers/respond');

module.exports = (event, context, callback) => {
  search({ author: event.queryStringParameters.author })
    .then(result => {
      // AWS returns a bunch of garbage we don't need.
      // Pluck out the valuable info, and return it to the client.
      //
      const books = result
        .map(book => {
          const author = _.get(book, 'ItemAttributes[0].Author[0]');
          const title = _.get(book, 'ItemAttributes[0].Title[0]');
          const image = _.get(book, 'LargeImage[0].URL[0]');

          if (!author || !title || !image) {
            return null;
          }

          // TODO: Filter by mediaType

          return { author, title, image };
        })
        .filter(book => !!book);

      const response = respond(200, {
        books,
        author: event.queryStringParameters.author,
      })

      callback(null, response);
    })
    .catch(error => {
      callback(null, respond(500, { error: error }));
    });
};

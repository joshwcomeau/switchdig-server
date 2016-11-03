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
          const id = _.get(book, 'ASIN[0]');
          const author = _.get(book, 'ItemAttributes[0].Author[0]');
          const title = _.get(book, 'ItemAttributes[0].Title[0]');
          const image = _.get(book, 'LargeImage[0].URL[0]');

          if (!author || !title || !image) {
            return null;
          }

          // TODO: Filter by mediaType

          return { id, author, title, image };
        })
        .filter(book => !!book);

      // It's possible that, for example, 2 of the 10 results are from another
      // author with a similar name. We want to only return the books from the
      // most popular author.
      const authorsByCount = _.countBy(books, 'author');
      const maxRepeated = _.max(_.values(authorsByCount));
      const author = _.findKey(authorsByCount, count => count === maxRepeated);
      const filteredBooks = books.filter(book => book.author === author);

      const response = respond(200, {
        author,
        books: filteredBooks,
      })

      callback(null, response);
    })
    .catch(error => {
      callback(null, respond(500, { error: error }));
    });
};

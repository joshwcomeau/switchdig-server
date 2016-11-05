'use strict';

const _ = require('lodash');

const apiHelpers = require('../helpers/product-advertising-api');
const respond = require('../helpers/respond');

module.exports = (event, context, callback) => {
  const searchedAuthor = event.queryStringParameters.author;
  const searchedMediaTypes = event.queryStringParameters.mediaTypes;

  const bindings = apiHelpers.getBindingFromMediaTypes(searchedMediaTypes);

  apiHelpers.search({ author: searchedAuthor, power: bindings })
    .then(result => {
      // AWS returns a bunch of garbage we don't need.
      // Pluck out the valuable info, and return it to the client.
      //
      const books = result
        .map(book => {
          const id = _.get(book, 'ASIN[0]');
          console.log("BINDING", _.get(book, 'ItemAttributes[0].Binding'));
          const author = _.get(book, 'ItemAttributes[0].Author[0]');
          const title = _.get(book, 'ItemAttributes[0].Title[0]');
          const image = _.get(book, 'LargeImage[0].URL[0]');

          if (!author || !title || !image) {
            return null;
          }

          return { id, author, title, image };
        })
        .filter(book => !!book);

      // If the supplied author name is a perfect match for any of the authors,
      // take that one. Sometimes the most popular author is wrong!
      const perfectMatchBook = books.find(book => (
        book.author.toLowerCase() === searchedAuthor.toLowerCase()
      ));

      let author;

      if (perfectMatchBook) {
        author = perfectMatchBook.author;
      } else {
        // If no perfect match was found, the most likely author is the one
        // with the most results. Let's trust Amazon's relevancy for this.
        const authorsByCount = _.countBy(books, 'author');
        const maxRepeated = _.max(_.values(authorsByCount));

        author = _.findKey(authorsByCount, count => count === maxRepeated);
      }

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

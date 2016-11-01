'use strict';
require('dotenv').config();

module.exports.searchAuthor = require('./handlers/search-author');
module.exports.subscribeToAuthor = require('./handlers/subscribe-to-author');
module.exports.listUsers = require('./handlers/list-users');

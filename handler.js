'use strict';
require('dotenv').config();

module.exports.searchAuthor = require('./handlers/search-author');
module.exports.subscribe = require('./handlers/subscribe');
module.exports.listUsers = require('./handlers/list-users');

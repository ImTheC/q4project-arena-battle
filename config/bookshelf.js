var environment = process.env.NODE_ENV || 'development';
var config = require('../knexfile')[environment];
var knex = require('knex')(config);
var bookshelf = require('bookshelf')(knex);

bookshelf.plugin('virtuals');
bookshelf.plugin('visibility');

knex.migrate.latest();

module.exports = bookshelf;

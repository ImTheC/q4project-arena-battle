var dotenv = require('dotenv');

dotenv.load();

module.exports = {

	development: {
		client: 'pg',
		connection: 'postgres://localhost/battletest',
		migrations: {
			tableName: 'knex_migrations',
			directory: 'db/migrations'
		},

		seeds: {
			directory: 'db/seeds'
		}
	},

	production: {
		client: 'pg',
		connection: process.env.DATABASE_URL
	}

};

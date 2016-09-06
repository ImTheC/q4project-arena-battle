exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function(table) {
      table.increments();
      table.string('name');
			table.string('username').unique();
      table.string('email').unique();
			table.bigInteger('score');
			table.integer('wins');
			table.integer('losses');
			table.integer('level');
      table.string('password');
      table.string('passwordResetToken');
      table.dateTime('passwordResetExpires');
      table.string('gender');
      table.string('location');
      table.string('website');
      table.string('picture');
      table.string('facebook');
      table.string('twitter');
      table.string('google');
      table.timestamps();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users')
  ])
};

exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('friends', function(table) {
      table.increments();
      table.integer('user1').unique();
      table.integer('user2').unique();
      table.integer('status');
      table.timestamps();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('friends')
  ])
};

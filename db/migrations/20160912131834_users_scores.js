exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', function(table) {
      table.dropColumn('score');
			table.bigInteger('lifegamescore').defaultTo(0);
			table.integer('bestgamescore').defaultTo(0);
      table.dropColumn('wins');
      table.dropColumn('losses');
      table.dropColumn('level');
			table.integer('highestlevel').defaultTo(0);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', function(table) {
			table.bigInteger('score');
			table.dropColumn('lifegamescore');
			table.dropColumn('bestgamescore');
			table.integer('wins');
      table.integer('losses');
      table.integer('level');
			table.dropColumn('highestlevel');
})
  ])
};


exports.up = function(knex) {
  return knex.schema.table('users', function (table) {
    table.string('firstname').defaultTo('').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', function (table) {
    table.dropColumn('firstname');
  });
};

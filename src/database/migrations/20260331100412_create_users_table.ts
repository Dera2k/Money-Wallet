import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('email', 255).notNullable().unique();
    table.string('first_name', 100).notNullable();
    table.string('last_name', 100).notNullable();
    table.boolean('is_blacklisted').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    //indexes
    table.index('email');
    table.index('is_blacklisted');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('users');
}
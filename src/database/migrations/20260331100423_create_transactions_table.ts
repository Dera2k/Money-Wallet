import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.enum('type', ['FUND', 'TRANSFER', 'WITHDRAW']).notNullable();
    table.decimal('amount', 12, 2).notNullable();
    table.enum('status', ['PENDING', 'SUCCESS', 'FAILED']).notNullable();
    table.string('reference', 100).notNullable().unique();
    table.uuid('sender_wallet_id').nullable();
    table.uuid('receiver_wallet_id').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.foreign('sender_wallet_id').references('id').inTable('wallets').onDelete('SET NULL');
    table.foreign('receiver_wallet_id').references('id').inTable('wallets').onDelete('CASCADE');

    table.index('reference');
    table.index('sender_wallet_id');
    table.index('receiver_wallet_id');
    table.index('type');
    table.index('status');
    table.index('created_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('transactions');
}
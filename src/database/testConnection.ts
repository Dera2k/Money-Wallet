import db from './knex';

const testConnection = async () => {
  try {
    const result = await db.raw('SELECT 1 + 1 AS result');
    console.log('Database connected successfully');
    console.log('Test query result:', result[0]);

    // kill
    await db.destroy();
    process.exit(0);
  } 
  catch (error) {
    console.error('Database connection failed:', error);
    await db.destroy();
    process.exit(1);
  }
};

testConnection();
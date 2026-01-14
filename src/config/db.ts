import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Use test database in test environment
const isTestEnv = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined;
const connectionString = isTestEnv
  ? process.env.TEST_DATABASE_URL || 'postgresql://daudsaid@localhost:5432/authentication_authorization_api_test'
  : process.env.DATABASE_URL;

const pool = new Pool({
  connectionString
});


pool.on('error', (err) => {
  console.error('❌ Database connection error:', err.message);
  // Don't crash the app - just log the error
});

export default pool;

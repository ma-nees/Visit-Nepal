import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 8080),
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/visitnepal',
  dbPoolMax: Number(process.env.DB_POOL_MAX || 25),
  dbIdleTimeoutMs: Number(process.env.DB_IDLE_TIMEOUT_MS || 15000),
  dbConnectionTimeoutMs: Number(process.env.DB_CONNECTION_TIMEOUT_MS || 8000),
  jwtSecret:
    process.env.JWT_SECRET || 'dev_super_secret_jwt_key_visitnepal_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim()),
};


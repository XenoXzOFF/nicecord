/**
 * Configuration centralisée — validation des variables d'environnement au démarrage.
 */
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT ?? 4000,
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  redisUrl: process.env.REDIS_URL,
};

// Fail-fast validation for critical env vars
if (!config.jwtSecret) {
  throw new Error('JWT_SECRET environment variable is not set');
}

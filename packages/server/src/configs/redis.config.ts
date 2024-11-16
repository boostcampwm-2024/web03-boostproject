export function getRedisConfig() { 
  return {
	host: process.env.REDIS_HOST || '127.0.0.1',
	port: Number(process.env.REDIS_PORT) || 3308,
	password: process.env.REDIS_PASSWORD || undefined,
	db: Number(process.env.REDIS_DB) || 0,
  }
};

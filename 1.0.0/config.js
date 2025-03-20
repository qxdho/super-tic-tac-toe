module.exports = {
    PORT: process.env.PORT || 3000,
    MAX_PLAYERS: 4,
    DEFAULT_TIME_LIMIT: 20, // 秒
    DEPLOY_PASSWORD: process.env.DEPLOY_PASSWORD || 'supersecret',
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379'
  };
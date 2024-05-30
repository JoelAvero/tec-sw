import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    port: parseInt(process.env.PORT, 10),
    stage: process.env.STAGE,
    baseUrl: process.env.BASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    syncMoviesFrequency: process.env.SYNC_MOVIES_FREQUENCY,
    postgres: {
      name: process.env.POSTGRES_DB,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      host: process.env.POSTGRES_HOST,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    },
  };
});

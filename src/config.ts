import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    port: parseInt(process.env.PORT, 10),
    stage: process.env.STAGE,
  };
});

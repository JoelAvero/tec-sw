import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, validateSync } from 'class-validator';

enum Environment {
  Local = 'local',
  Development = 'dev',
  Production = 'prod',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  STAGE: Environment;

  @IsNumber()
  @IsNotEmpty()
  PORT: number;

  //TODO: Validate the rest of the variables
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}

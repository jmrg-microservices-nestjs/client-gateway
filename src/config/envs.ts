import 'dotenv/config';
import * as Joi from 'joi';

interface EnvVars {
  PORT: number;
  NODE_ENV: 'development' | 'production';
  MS_PRODUCT_HOST: string;
  MS_PRODUCT_PORT: number;
}

const envVarsSchema: Joi.ObjectSchema = Joi.object({
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  MS_PRODUCT_HOST: Joi.string().required(),
  MS_PRODUCT_PORT: Joi.number().required(),
}).unknown(true);

const { error, value } = envVarsSchema.validate(process.env, {
  abortEarly: false,
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  PORT: envVars.PORT,
  NODE_ENV: envVars.NODE_ENV,
  MS_PRODUCT_HOST: envVars.MS_PRODUCT_HOST,
  MS_PRODUCT_PORT: envVars.MS_PRODUCT_PORT,
};

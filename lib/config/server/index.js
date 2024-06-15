const Joi = require("joi");

const schema = Joi.object({
  API_PORT: Joi.number().default(5001).required(),
  IS_PRODUCTION: Joi.boolean().default(false).required(),
  API_HOST: Joi.string().default("127.0.0.1").required(),
  NODE_ENV: Joi.string()
    .valid("development", "production")
    .default("development")
    .required(),
  SQL_DATABASE_CONNECTION_LIMIT: Joi.string().default(10).required(),
  SQL_DATABASE_HOST: Joi.string().required(),
  SQL_DATABASE_PORT: Joi.string().required(),
  SQL_DATABASE_USER: Joi.string().required(),
  SQL_DATABASE_PASSWORD: Joi.string().required(),
  SQL_DATABASE_NAME: Joi.string().required(),
  SALT_ROUNDS: Joi.string().default(10).required(),
  JWT_SECRET: Joi.string().required(),
  JWT_AUTH_EXPIRES_IN: Joi.string().required(),
}).unknown(true);

const { error, value } = schema.validate(process.env, { abortEarly: false });

if (error) {
  console.log(error);
  throw new Error(`Environment variable validation error: ${error.message}`);
}

// add all keys from schema here , just for auto completion in other files
// these dummy values will be overwritten in next step

const env = {
  API_HOST: "",
  API_PORT: 0,
  IS_PRODUCTION: "",
  NODE_ENV: "",
  SQL_DATABASE_CONNECTION_LIMIT: 0,
  SQL_DATABASE_HOST: "",
  SQL_DATABASE_PORT: 0,
  SQL_DATABASE_USER: "",
  SQL_DATABASE_NAME: "",
  SQL_DATABASE_PASSWORD: "",
  SALT_ROUNDS: 10,
  JWT_SECRET: "",
  JWT_AUTH_EXPIRES_IN: "",
};

//reset values of env object here to the validated values
Object.keys(schema.describe().keys).forEach((key) => {
  env[key] = value[key];
});

module.exports = { env };

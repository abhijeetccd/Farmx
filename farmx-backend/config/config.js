require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_DEV_USERNAME || "postgres",
    password: process.env.DB_DEV_PASSWORD || "mukul123",
    database: process.env.DB_DEV_NAME || "farmexdb",
    host: process.env.DB_DEV_HOST || "127.0.0.1",
    dialect: "postgres",
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Required for Render's free PostgreSQL
      },
    },
  },
};

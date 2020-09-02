const yn = require("yn");

module.exports = {
  type: "postgres",
  host: process.env.POSTRGRES_IP,
  port: process.env.POSTRGRES_PORT,
  username: process.env.POSTRGRES_USERNAME,
  password: process.env.POSTRGRES_PASSWORD,
  database: process.env.POSTRGRES_DATABASE,
  synchronize: yn(process.env.POSTRGRES_SYNCHRONIZE),
  logging: ["warn", "error", "log", "info"],
  entities: ["src/models/**/*.entity.{ts,js}"],
  migrations: ["src/migration/**/*.{ts,js}"],
  subscribers: ["src/models/**/*.subscriber.{ts,js}"],
  cli: {
    entitiesDir: "src/models",
    migrationsDir: "src/migration",
    subscribersDir: "src/models",
  },
};

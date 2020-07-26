const yn = require("yn");

module.exports = {
  type: "postgres",
  host: process.env.POSTRGRES_IP,
  port: process.env.POSTRGRES_PORT,
  username: process.env.POSTRGRES_USERNAME,
  password: process.env.POSTRGRES_PASSWORD,
  database: process.env.POSTRGRES_DATABASE,
  synchronize: yn(process.env.POSTRGRES_SYNCHRONIZE),
  logging: yn(process.env.POSTRGRES_LOGGING),
  entities: ["dist/app/entity/**/*.{ts,js}"],
  migrations: ["src/app/migration/**/*.{ts,js}"],
  subscribers: ["src/app/subscriber/**/*.{ts,js}"],
  cli: {
    entitiesDir: "src/app/entity",
    migrationsDir: "src/app/migration",
    subscribersDir: "src/app/subscriber",
  },
};

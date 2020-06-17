import "dotenv/config";
import "reflect-metadata";

import cors from "cors";
import express from "express";
import cookieParcer from "cookie-parser";

import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import { createConnection } from "typeorm";

import { UserResolver } from "./models/user/resolvers";
import { TodoResolver } from "./models/todo/resolvers";

const appRouter = require("./routes/app");

const port = process.env.PORT || 4000;

(async () => {
  const app = express();

  app.use(
    cors({
      origin: "*",
      credentials: true,
    }),
    cookieParcer()
  );

  app.use("/", appRouter);

  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, TodoResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(port, () => {
    console.log(`express server started on port ${port}`);
  });
})();

import "dotenv/config";
import "reflect-metadata";

import cors from "cors"
import http from "http"
import express from "express"
import cookieParcer from 'cookie-parser'
// import * as cors from "cors"
// import * as http from "http"
// import * as express from "express"
// import * as cookieParcer from 'cookie-parser'

import appRouter from "./routes/app";

import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import { createConnection } from "typeorm";

// ******* resolver *******
import { UserResolver } from "./models/user/user.resolver";
import { ProfileResolver } from "./models/profile/profile.resolver";
import { SettingsResolver } from "./models/settings/settings.resolver";
import { TodoListResolver } from "./models/todo-list/todo-list.resolver";
import { TodoItemResolver } from "./models/todo-item/todo-item.resolver";

const port = process.env.PORT || 4000;

(async () => {
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:8080",
      credentials: true,
    })
  );

  app.use(cookieParcer());

  app.use("/", appRouter);

  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        UserResolver,
        ProfileResolver,
        SettingsResolver,
        TodoListResolver,
        TodoItemResolver,
      ],
    }),
    context: ({ req, res }) => ({ req, res }),
    subscriptions: {
      path: "/graphql",
      onConnect: async (_connectionParams, _webSocket) => {
        console.log(
          `Subscription client connected using Apollo server's built-in SubscriptionServer.`
        );

        // console.log(connectionParams, webSocket);

        // if (connectionParams.authToken) {
        //   return validateToken(connectionParams.authToken)
        //     .then(findUser(connectionParams.authToken))
        //     .then((user) => {
        //       return {
        //         currentUser: user,
        //       };
        //     });
        // }

        // throw new Error("Missing auth token!");
      },
      onDisconnect: async (_webSocket, _context) => {
        console.log(`Subscription client disconnected.`);
      },
    },
  });

  apolloServer.applyMiddleware({ app, cors: false });

  const httpServer = http.createServer(app);
  apolloServer.installSubscriptionHandlers(httpServer);

  httpServer.listen(port, () => {
    console.log(
      `🚀 Server ready at http://localhost:${port}${apolloServer.graphqlPath}`
    );
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${port}${apolloServer.subscriptionsPath}`
    );
  });
})();

import express from "express";
import cors from "cors";
import { createYoga, createSchema } from "@graphql-yoga/node";
import jwt from "jsonwebtoken";
import { fakeUser } from "./User";

const SECRET = "supersecret";

const typeDefs = /* GraphQL */ `
  type Query {
    secretData: String!
  }

  type Mutation {
    login(username: String!, password: String!): String!
  }
`;

const resolvers = {
  Query: {
    secretData: (_: any, __: any, context: any) => {
      if (!context.user) {
        throw new Error("Нет доступа");
      }
      return "Секретная информация";
    },
  },
  Mutation: {
    login: async (_: any, { username, password }: any) => {
      if (username !== fakeUser.username) {
        throw new Error("Неверный логин");
      }

      const isValid = await import("bcryptjs").then((mod) =>
        mod.compare(password, fakeUser.password)
      );
      if (!isValid) {
        throw new Error("Неверный пароль");
      }

      const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
      return token;
    },
  },
};

const yoga = createYoga({
  schema: createSchema({ typeDefs, resolvers }),
  context: ({ request }) => {
    const authHeader = request.headers.get("authorization");
    let user = null;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, SECRET);
        user = decoded;
      } catch (e) {
        // Токен недействителен
      }
    }

    return { user };
  },
});

const app = express();
app.use(cors());
app.use("/graphql", yoga);

app.listen(4000, () => {
  console.log("GraphQL Yoga работает на http://localhost:4000/graphql");
});

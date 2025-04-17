import { createSchema } from "graphql-yoga";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { fakeUser } from "./User";

const SECRET = "supersecret";

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      secretData: String!
    }

    type Mutation {
      login(username: String!, password: String!): String!
    }
  `,
  resolvers: {
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

        const valid = await bcrypt.compare(password, fakeUser.password);
        if (!valid) {
          throw new Error("Неверный пароль");
        }

        const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
        return token;
      },
    },
  },
});

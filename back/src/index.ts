import express from "express";
import { createYoga, createSchema } from "graphql-yoga";
import dotenv from "dotenv";
import { connectDB } from "./utils/db";
import cors from "cors";
import jwt from "jsonwebtoken";
import { schema } from "./schema";

dotenv.config();

const SECRET = "supersecret";

// const SECRET = "supersecret";

// const typeDefs = /* GraphQL */ `
//   scalar JSON
//   scalar Date

//   type PresignedPostData {
//     url: String!
//     fields: JSON!
//   }

//   type File {
//     _id: ID!
//     name: String!
//     url: String!
//     createdAt: String!
//     updatedAt: String!
//   }

//   type Query {
//     secretData: String!
//     getPresignedPost(fileName: String!): PresignedPostData!
//   }

//   input SaveFileInput {
//     name: String!
//     url: String!
//   }

//   type Mutation {
//     login(username: String!, password: String!): String!
//     saveFiles(files: [SaveFileInput!]!): [File!]!
//   }
// `;

// const resolvers = {
//   Query: {
//     secretData: (_: any, __: any, context: any) => {
//       if (!context.user) {
//         throw new Error("Нет доступа");
//       }
//       return "Секретная информация";
//     },
//     getPresignedPost: async (_: any, { fileName }: { fileName: string }) => {
//       const data = await createPresignedPost(fileName);
//       return {
//         url: data.url,
//         fields: data.fields,
//       };
//     },
//   },
//   Mutation: {
//     login: async (_: any, { username, password }: any) => {
//       if (username !== fakeUser.username) {
//         throw new Error("Неверный логин");
//       }

//       const isValid = await bcrypt.compare(password, fakeUser.password);
//       if (!isValid) {
//         throw new Error("Неверный пароль");
//       }

//       const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
//       return token;
//     },
//     saveFiles: async (
//       _: any,
//       { files }: { files: { name: string; url: string }[] }
//     ) => {
//       return await FileModel.insertMany(files);
//     },
//   },
// };

async function main() {
  try {
    await connectDB();

    const app = express();

    const yoga = createYoga({
      schema,
      graphqlEndpoint: "/graphql",
      context: ({ request }) => {
        const auth = request.headers.get("authorization");
        let user = null;

        if (auth?.startsWith("Bearer ")) {
          const token = auth.slice(7);
          try {
            user = jwt.verify(token, SECRET);
          } catch {
            // недействительный токен — просто не передаём user
          }
        }

        return { user };
      },
    });

    app.use(cors({ origin: "http://localhost:3000", credentials: true }));
    app.use("/graphql", yoga);

    const PORT = 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.log("Error starting server:", error);
  }
}

main().catch(console.error);

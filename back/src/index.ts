import express from "express";
import { createYoga } from "graphql-yoga";
import dotenv from "dotenv";
import { connectDB } from "./utils/db";
import cors from "cors";
import jwt from "jsonwebtoken";
import { schema } from "./schema";

dotenv.config();

export const SECRET = "super secret";

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
      // context: ({ request, params }) => {
      //   const operationName = params?.operationName;
      //   if (operationName === "Login") {
      //     return { user: null };
      //   }

      //   const auth = request.headers.get("Authorization");
      //   if (!auth?.startsWith("Bearer ")) {
      //     throw new Error("Нет авторизации");
      //   }

      //   const token = auth.slice(7);
      //   console.log(`token: "${token}"`);
      //   console.log(`secret: "${SECRET}"`);
      //   try {
      //     const user = jwt.verify(token, "test", {
      //       ignoreExpiration: true,
      //     });
      //     return { user };
      //   } catch (err) {
      //     console.log("token err", err);
      //     throw new Error("Неверный или просроченный токен");
      //   }
      // },
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

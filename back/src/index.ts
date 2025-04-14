import express from "express";
import { createYoga } from "graphql-yoga";
import { schema } from "./schema";
import dotenv from "dotenv";
import { connectDB } from "./utils/db";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();

// Настройка GraphQL Yoga
const yoga = createYoga({
  schema,
  graphqlEndpoint: "/graphql",
  context: ({ request }) => ({}), // позже добавим пользователя
});

// Если хочешь явно управлять CORS (иначе yoga сам всё сделает)
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use("/graphql", yoga);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
});

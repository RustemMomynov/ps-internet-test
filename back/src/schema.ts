import { FileModel } from "./models/File";
import { createSchema } from "graphql-yoga";
import jwt from "jsonwebtoken";
import { fakeUser } from "./auth/User";
import bcrypt from "bcryptjs";
import { createPresignedPost } from "./utils/s3";

const SECRET = "supersecret";

const typeDefs = /* GraphQL */ `
  scalar JSON
  scalar Date

  type PresignedPostData {
    url: String!
    fields: JSON!
  }

  type File {
    _id: ID!
    name: String!
    size: String!
    type: String!
    url: String!
    createdAt: Date!
    updatedAt: Date!
  }

  input SaveFileInput {
    name: String!
    size: Float!
    type: String!
    url: String!
  }

  type FilePagination {
    items: [File!]!
    total: Int!
    page: Int!
    pageSize: Int!
  }

  type Query {
    secretData: String!
    getPresignedPost(fileName: String!): PresignedPostData!
    getFiles(page: Int, pageSize: Int, search: String): FilePagination!
  }

  type Mutation {
    login(username: String!, password: String!): String!
    saveFiles(files: [SaveFileInput!]!): [File!]!
    deleteFile(id: ID!): Boolean!
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
    getPresignedPost: async (_: any, { fileName }: { fileName: string }) => {
      const data = await createPresignedPost(fileName);
      return {
        url: data.url,
        fields: data.fields,
      };
    },
    getFiles: async (
      _: any,
      {
        page = 1,
        pageSize = 10,
        search = "",
      }: { page?: number; pageSize?: number; search?: string }
    ) => {
      const query = search ? { name: { $regex: search, $options: "i" } } : {};

      const [items, total] = await Promise.all([
        FileModel.find(query)
          .sort({ createdAt: -1 })
          .skip((page - 1) * pageSize)
          .limit(pageSize),
        FileModel.countDocuments(query),
      ]);

      return {
        items,
        total,
        page,
        pageSize,
      };
    },
  },
  Mutation: {
    saveFiles: async (
      _: any,
      { files }: { files: { name: string; url: string }[] }
    ) => {
      return await FileModel.insertMany(files);
    },
    deleteFile: async (_: any, { id }: { id: string }) => {
      const result = await FileModel.findByIdAndDelete(id);
      return !!result;
    },
    login: async (_: any, { username, password }: any) => {
      if (username !== fakeUser.username) {
        throw new Error("Неверный логин");
      }

      const isValid = await bcrypt.compare(password, fakeUser.password);
      if (!isValid) {
        throw new Error("Неверный пароль");
      }

      const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
      return token;
    },
  },
};

export const schema = createSchema({
  typeDefs,
  resolvers,
});

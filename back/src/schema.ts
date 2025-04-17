import { FileModel } from "./models/File";
import { createSchema } from "graphql-yoga";
import { createPresignedPost } from "./utils/s3";

const typeDefs = /* GraphQL */ `
  scalar JSON

  type PresignedPostData {
    url: String!
    fields: JSON!
  }

  type File {
    _id: ID!
    name: String!
    url: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    getPresignedPost(fileName: String!): PresignedPostData!
  }

  input SaveFileInput {
    name: String!
    url: String!
  }

  type Mutation {
    saveFiles(files: [SaveFileInput!]!): [File!]!
  }
`;

const resolvers = {
  Query: {
    getPresignedPost: async (_: any, { fileName }: { fileName: string }) => {
      const data = await createPresignedPost(fileName);
      return {
        url: data.url,
        fields: data.fields,
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
  },
};

export const schema = createSchema({
  typeDefs,
  resolvers,
});

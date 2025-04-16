import { createSchema } from "graphql-yoga";
import { fileResolvers } from "./resolvers/file";

const typeDefs = /* GraphQL */ `
  scalar Upload

  type File {
    _id: ID!
    name: String!
    size: Int!
    type: String!
    url: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    getFiles: [File!]!
  }

  input UploadFileInput {
    name: String!
    size: Int!
    type: String!
  }

  type Mutation {
    uploadFile(input: UploadFileInput!, file: Upload!): File!
  }
`;

export const schema = createSchema({
  typeDefs,
  resolvers: [fileResolvers],
});

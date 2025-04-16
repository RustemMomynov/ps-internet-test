import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";

export const apolloClient = new ApolloClient({
  link: createUploadLink({
    uri: "http://localhost:4000/graphql",
    credentials: "include",
  }) as any,
  cache: new InMemoryCache(),
});

import { gql } from "@apollo/client";

export const GET_FILES = gql`
  query getFiles($page: Int, $pageSize: Int, $search: String) {
    getFiles(page: $page, pageSize: $pageSize, search: $search) {
      items {
        _id
        name
        url
        size
        type
        createdAt
      }
      total
      page
      pageSize
    }
  }
`;

export const DELETE_FILE = gql`
  mutation DeleteFile($id: ID!) {
    deleteFile(id: $id)
  }
`;

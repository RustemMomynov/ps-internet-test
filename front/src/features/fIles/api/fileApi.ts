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

export const GET_PRESIGNED_POST = gql`
  query GetPresignedPost($fileName: String!) {
    getPresignedPost(fileName: $fileName) {
      url
      fields
    }
  }
`;

export const SAVE_FILES = gql`
  mutation SaveFiles($files: [SaveFileInput!]!) {
    saveFiles(files: $files) {
      _id
      name
      url
    }
  }
`;

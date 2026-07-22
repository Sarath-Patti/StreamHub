import { gql } from '@apollo/client';

export const USER_FRAGMENT = gql`
  fragment UserFields on User {
    id
    name
    email
    role
    createdAt
    updatedAt
  }
`;

export const AUTH_PAYLOAD_FRAGMENT = gql`
  ${USER_FRAGMENT}
  fragment AuthPayloadFields on AuthPayload {
    accessToken
    refreshToken
    user {
      ...UserFields
    }
  }
`;

export const ME_QUERY = gql`
  ${USER_FRAGMENT}
  query Me {
    me {
      ...UserFields
    }
  }
`;

export const LOGIN_MUTATION = gql`
  ${AUTH_PAYLOAD_FRAGMENT}
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      ...AuthPayloadFields
    }
  }
`;

export const REGISTER_MUTATION = gql`
  ${AUTH_PAYLOAD_FRAGMENT}
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      ...AuthPayloadFields
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

export const REFRESH_TOKEN_MUTATION = gql`
  ${AUTH_PAYLOAD_FRAGMENT}
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      ...AuthPayloadFields
    }
  }
`;

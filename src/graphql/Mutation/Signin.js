import { gql } from "@apollo/client";

export const SIGNIN = gql`
  mutation Signin($email: String!, $password: String!) {
    signin(input: { email: $email, password: $password }) {
      jwtToken
    }
  }
`;

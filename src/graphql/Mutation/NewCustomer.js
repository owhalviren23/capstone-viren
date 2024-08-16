import { gql } from "@apollo/client";

export const CREATE_NEW_CUSTOMER = gql`
  mutation createCustomer(
    $firstName: String!
    $lastName: String!
    $phone: String!
    $address: String!
    $email: String!
    $companyId: Int!
  ) {
    createCustomer(
      input: {
        customer: {
          firstName: $firstName
          lastName: $lastName
          phone: $phone
          address: $address
          email: $email
          companyId: $companyId
        }
      }
    ) {
      clientMutationId
    }
  }
`;

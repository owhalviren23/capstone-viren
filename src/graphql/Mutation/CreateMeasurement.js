import { gql } from "@apollo/client";

export const CREATE_CUSTOMER_MEASUREMENT = gql`
  mutation crtMEas(
    $pant: JSON!
    $sherwani: JSON!
    $shirt: JSON!
    $suit: JSON!
    $createdAt: Datetime!
    $coat: JSON!
    $customerId: Int!
  ) {
    createCustomerMeasurment(
      input: {
        customerMeasurment: {
          customerId: $customerId
          shirt: $shirt
          pant: $pant
          sherwani: $sherwani
          suit: $suit
          coat: $coat
          createdAt: $createdAt
        }
      }
    ) {
      clientMutationId
    }
  }
`;

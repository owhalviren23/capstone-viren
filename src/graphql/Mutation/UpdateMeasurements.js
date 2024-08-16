import { gql } from "@apollo/client";

export const UPDATE_CUSTOMER_MEASUREMENT = gql`
  mutation updateMeasurement(
    $pant: JSON
    $sherwani: JSON
    $shirt: JSON
    $suit: JSON
    $updatedAt: Datetime
    $coat: JSON
    $customerId: Int!
  ) {
    updateCustomerMeasurmentByCustomerId(
      input: {
        customerMeasurmentPatch: {
          sherwani: $sherwani
          coat: $coat
          suit: $suit
          pant: $pant
          shirt: $shirt
          updatedAt: $updatedAt
        }
        customerId: $customerId
      }
    ) {
      clientMutationId
    }
  }
`;

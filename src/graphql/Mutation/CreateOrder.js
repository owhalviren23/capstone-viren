import { gql } from "@apollo/client";

export const CREATE_ORDER = gql`
  mutation createOrder($order: OrderInput!) {
    createOrder(input: { order: $order }) {
      clientMutationId
    }
  }
`;

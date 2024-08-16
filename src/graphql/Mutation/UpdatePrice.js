import { gql } from "@apollo/client";

export const UPDATE_PRICE = gql`
  mutation updatePrice(
    $companyId: Int!
    $pantPrice: Int
    $sherwaniPrice: Int
    $shirtPrice: Int
    $suitPrice: Int
    $coatPrice: Int
    $updatedAt: Datetime
  ) {
    updatePriceByCompanyId(
      input: {
        pricePatch: {
          pantPrice: $pantPrice
          sherwaniPrice: $sherwaniPrice
          shirtPrice: $shirtPrice
          suitPrice: $suitPrice
          coatPrice: $coatPrice
          updatedAt: $updatedAt
        }
        companyId: $companyId
      }
    ) {
      clientMutationId
    }
  }
`;

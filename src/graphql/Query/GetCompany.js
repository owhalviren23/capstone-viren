import { gql, useQuery } from "@apollo/client";
import decodeJwt from "../../Utils/decodeJwt.js";
const GET_COMPANY_DATA = gql`
  query prices {
    allUsers {
      nodes {
        companiesByOwnerId {
          nodes {
            companyName
            id
            companyAddress
            priceByCompanyId {
              id
              coatPrice
              companyId
              coatPrice
              companyId
              createdAt
              id
              pantPrice
              sherwaniPrice
              shirtPrice
              suitPrice
              updatedAt
            }
          }
        }
      }
    }
  }
`;

const GetCompanyData = () => {
  const userID = decodeJwt()?.user_id;
  const { data, loading, error } = useQuery(GET_COMPANY_DATA, {
    variables: { id: userID },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const hasCompany =
    data.allUsers?.nodes[0].companiesByOwnerId.nodes.length > 0;
  const companyData = data.allUsers?.nodes[0].companiesByOwnerId.nodes;
  return { hasCompany, companyData, loading, error };
};

export default GetCompanyData;

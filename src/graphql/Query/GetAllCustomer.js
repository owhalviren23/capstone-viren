import { gql, useQuery } from "@apollo/client";

export const GET_CustomerByCompanyId = gql`
  query customersByCompanyId($id: Int!) {
    companyById(id: $id) {
      id
      customersByCompanyId {
        nodes {
          id
          firstName
          lastName
          phone
          email
          address
          createdAt
          updatedAt
          companyId
        }
      }
    }
  }
`;

const GetCustomerByCompanyId = (id) => {
  const { data, loading, error } = useQuery(GET_CustomerByCompanyId, {
    variables: { id: id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const customers = data?.companyById?.customersByCompanyId?.nodes;

  return { customers, loading, error };
};

export default GetCustomerByCompanyId;

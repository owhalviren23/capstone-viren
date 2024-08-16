import { gql, useQuery } from "@apollo/client";

export const GET_CUSTOMER_MEASUREMENTS = gql`
  query customerMeasurmentByCustomerId($customerId: Int!) {
    customerMeasurmentByCustomerId(customerId: $customerId) {
      coat
      customerId
      id
      createdAt
      pant
      sherwani
      shirt
      suit
    }
  }
`;
const GetCustomerMeasurementsByCustomerId = (customerId) => {
  const { data, loading, error } = useQuery(GET_CUSTOMER_MEASUREMENTS, {
    variables: { customerId: customerId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const measurements = data?.customerMeasurmentByCustomerId;

  return { measurements, loading, error };
};

export default GetCustomerMeasurementsByCustomerId;

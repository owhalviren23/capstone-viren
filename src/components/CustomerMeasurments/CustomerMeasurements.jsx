import React, { useEffect, useState } from "react";
import Segmented from "../../components/Segmented/Segmented";
import "./CustomerMeasurements.css";
import { useMutation } from "@apollo/client";
import { CREATE_CUSTOMER_MEASUREMENT } from "../../graphql/Mutation/CreateMeasurement";
import { UPDATE_CUSTOMER_MEASUREMENT } from "../../graphql/Mutation/UpdateMeasurements";
import GetCustomerMeasurementsByCustomerId, {
  GET_CUSTOMER_MEASUREMENTS,
} from "../../graphql/Query/GetCustomerMeasurementsByCustomerId";

const CustomerMeasurements = ({ customerId, clothType: initialClothType }) => {
  const [clothType, setClothType] = useState(initialClothType);

  const defaultMeasurements = {
    shirt: { neck: "", chest: "", hip: "", waist: "", sleeve: "", length: "" },
    pant: { length: "", waist: "", hip: "", thigh: "" },
    sherwani: {
      neck: "",
      chest: "",
      hip: "",
      waist: "",
      sleeve: "",
      length: "",
    },
    suit: { neck: "", chest: "", hip: "", waist: "", sleeve: "", length: "" },
    coat: { neck: "", chest: "", hip: "", waist: "", sleeve: "", length: "" },
  };

  const [measurementInput, setMeasurementInput] = useState({
    [initialClothType]: defaultMeasurements[initialClothType],
  });

  const [newMeasurement] = useMutation(CREATE_CUSTOMER_MEASUREMENT, {
    onCompleted: (data) => {},
    onError: (error) => {},
  });

  const [updateCustomerMeasurement] = useMutation(UPDATE_CUSTOMER_MEASUREMENT, {
    onCompleted: (data) => {},
    onError: (error) => {},
  });

  const { measurements, loading, error } =
    GetCustomerMeasurementsByCustomerId(customerId);

  useEffect(() => {
    if (measurements) {
      const clothDataString = measurements[clothType.toLowerCase()];
      const clothDataObj = clothDataString
        ? JSON.parse(clothDataString)
        : defaultMeasurements[clothType];
      setMeasurementInput((prevState) => ({
        ...prevState,
        [clothType]: { ...clothDataObj },
      }));
    } else {
      setMeasurementInput((prevState) => ({
        ...prevState,
        [clothType]: defaultMeasurements[clothType],
      }));
    }
  }, [clothType, measurements]);

  const currentMeasurements = measurementInput[clothType] || {};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMeasurementInput((prevState) => ({
      ...prevState,
      [clothType]: {
        ...prevState[clothType],
        [name]: value,
      },
    }));
  };

  const handleFormSubmit = () => {
    if (measurements) {
      const updatedMeasurement = JSON.stringify(measurementInput[clothType]);
      const variables = {
        [clothType.toLowerCase()]: updatedMeasurement,
        updatedAt: new Date(),
        customerId: customerId,
      };

      updateCustomerMeasurement({
        variables: { ...variables },
        refetchQueries: [
          {
            query: GET_CUSTOMER_MEASUREMENTS,
            variables: { customerId: customerId },
          },
        ],
      });
    } else if (!measurements) {
      const mergedMeasurements = Object.keys(defaultMeasurements).reduce(
        (acc, clothType) => {
          acc[clothType] = JSON.stringify(
            measurementInput[clothType] || defaultMeasurements[clothType]
          );
          return acc;
        },
        {}
      );

      const variables = {
        customerId: customerId,
        createdAt: new Date(),
        ...mergedMeasurements,
      };
      newMeasurement({ variables: { ...variables } });
    }
  };

  const getFilteredData = () => {
    try {
      return Object.entries(currentMeasurements).map(([key, value]) => (
        <div key={key} className="customer-meas-upper-wrap">
          <label className="customer-meas-label">{`${
            key.charAt(0).toUpperCase() + key.slice(1)
          }`}</label>
          <input
            className="customer-meas-input"
            type="number"
            name={key}
            value={value}
            onChange={handleInputChange}
          />
        </div>
      ));
    } catch (error) {
      console.error("Error parsing measurement data:", error);
      return <p>Error parsing measurement data</p>;
    }
  };

  return (
    <>
      <span className="close">&times;</span>
      <Segmented
        options={["Shirt", "Pant", "Sherwani", "Suit", "Coat"]}
        onChange={(value) => setClothType(value.toLowerCase())}
      />
      <h3>
        {clothType.charAt(0).toUpperCase() + clothType.slice(1)} Measurements
      </h3>
      {loading && <p>Loading...</p>}
      {error && <p>Error :(</p>}
      <div>{getFilteredData()}</div>
      <div style={{ textAlign: "left" }}>
        <button onClick={handleFormSubmit} className="customer-meas-btn">
          Add/Update
        </button>
      </div>
    </>
  );
};

export default CustomerMeasurements;

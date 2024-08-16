import React, { useState } from "react";
import Drawer from "../Drawer/Drawer";
import CustomerMeasurements from "../CustomerMeasurments/CustomerMeasurements";
import { useMutation } from "@apollo/client";
import { CREATE_NEW_CUSTOMER } from "../../graphql/Mutation/NewCustomer";
import Cookies from "js-cookie";
import { GET_CustomerByCompanyId } from "../../graphql/Query/GetAllCustomer";

const CustomerTable = (props) => {
  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    email: "",
  });
  const companyId = parseInt(Cookies.get("shopId"));
  const [newCustomerDrawer, setNewCustomerDrawer] = useState(false);
  const [customerMeasurementDrawer, setCustomerMeasurementDrawer] =
    useState(false);
  const customersData = props.tableData;
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newCustomer] = useMutation(CREATE_NEW_CUSTOMER, {
    onCompleted: (data) => {
      setNewCustomerDrawer(false);
    },
    onError: (error) => {},
  });
  const handleMeasurement = (id) => {
    setSelectedCustomer(id);
    setCustomerMeasurementDrawer(true);
  };

  const handleNewCustomer = () => {
    setNewCustomerDrawer(true);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleAddCustomer = (e) => {
    e.preventDefault();
    newCustomer({
      variables: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        address: customer.address,
        phone: customer.phone,
        email: customer.email,
        companyId: companyId,
      },
      refetchQueries: [
        {
          query: GET_CustomerByCompanyId,
          variables: { id: companyId },
        },
      ],
    });
    setCustomer({
      firstName: "",
      lastName: "",
      address: "",
      phone: "",
      email: "",
    });
  };

  return (
    <>
      <main className="content">
        <button onClick={handleNewCustomer}style={{
            backgroundColor:"#007bff",
            color:"white",
            padding:"10px 20px",
            border:"none",
            marginBottom:"10px",
            borderRadius:"5px",
            cursor:"pointer"
        }}> Add Customer</button>
        {customersData && (
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Measurements</th>
              </tr>
            </thead>
            <tbody>
              {customersData.map((record) => (
                <tr key={record.id}>
                  <td>{record.firstName}</td>
                  <td>{record.lastName}</td>
                  <td>{record.address}</td>
                  <td>{record.phone}</td>
                  <td>{record.email}</td>
                  <td>
                    <button
                      style={{
                        backgroundColor: "transparent",
                        color: "#1677ff",
                        border: "none",
                        cursor: "pointer",
                        transition: "color 0.3s",
                      }}
                      onClick={() => {
                        handleMeasurement(record.id);
                      }}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
      <div>
        <Drawer
          isOpen={newCustomerDrawer}
          onClose={() => setNewCustomerDrawer(false)}
        >
          <div>
            <h3>Add New Customer</h3>
            <form onSubmit={handleAddCustomer}>
              <div className="form-item">
                <label htmlFor="firstName">First Name:</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={customer.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-item">
                <label htmlFor="lastName">Last Name:</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={customer.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-item">
                <label htmlFor="address">Address:</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={customer.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-item">
                <label htmlFor="phone">Phone:</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={customer.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-item">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={customer.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="form-button">
                Add
              </button>
            </form>
          </div>
        </Drawer>
      </div>

      <div>
        <Drawer
          isOpen={customerMeasurementDrawer}
          onClose={() => setCustomerMeasurementDrawer(false)}
        >
          <div>
            <CustomerMeasurements
              customerId={selectedCustomer}
              clothType="shirt"
            />
          </div>
        </Drawer>
      </div>
    </>
  );
};

export default CustomerTable;

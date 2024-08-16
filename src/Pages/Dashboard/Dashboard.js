import React, { useState } from "react";
import "./Dashboard.css";
import Cookies from "js-cookie";
import GetPrices from "../../graphql/Query/GetPrices";
import CustomerTable from "../../components/CustomerTable/CustomerTable";
import OrderTable from "../../components/OrderTable/OrderTable";
import Drawer from "../../components/Drawer/Drawer";
import GetAllOrders from "../../graphql/Query/GetAllOrders";
import GetCustomerByCompanyId from "../../graphql/Query/GetAllCustomer";
import Prices from "../../components/Prices/Prices";
import { useNavigate } from "react-router-dom";
import ShopDetails from "../../components/ShopDetails/ShopDetails";
import AccountDetails from "../../components/AccountDetails/AccountDetails";

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState("");
  const [activeSubmenu, setActiveSubmenu] = useState("");
  const [tableContent, setTableContent] = useState("orders");
  const companyId = parseInt(Cookies.get("shopId"));
  const CompnayPrices = GetPrices(companyId);
  const email = Cookies.get("email");
  const password = Cookies.get("password");

  const navigate = useNavigate();
  const shopInfo = Cookies.get("shopName");
  const {
    allOrders,
    completedOrders,
    pendingOrders,
    orderLoading,
    orderError,
  } = GetAllOrders(companyId);

  const { customers, customerLoading, customerError } =
    GetCustomerByCompanyId(companyId);

  const data = [
    {
      id: 1,
      customerByCustomerId: {
        firstName: "Viren",
        lastName: "Owhal",
      },
      deliveryDate: "2024-08-14",
      totalCounts: 10,
      totalPrice: 100.0,
      orderStatus: "pending",
    },
    {
      id: 2,
      customerByCustomerId: {
        firstName: "Roy",
        lastName: "Pauul",
      },
      deliveryDate: "2024-08-03",
      totalCounts: 20,
      totalPrice: 200.0,
      orderStatus: "completed",
    },
  ];

  const handleLogout = () => {
    Cookies.remove("jwtToken");
    Cookies.remove("shopId");
    Cookies.remove("shopName");
    Cookies.remove("shopAddress");
    navigate("/");
  };
  const handleMenuClick = (menu) => {
    setActiveMenu(activeMenu === menu ? "" : menu);
  };

  const handleSubmenuClick = (submenu) => {
    setActiveSubmenu(submenu);
    setTableContent(submenu);
  };
  const handleClick = (e, id) => {
    e.preventDefault();
    console.log(`Completing order with ID: ${id}`);
  };

  return (
    <div className="dashboard">
      <header className="header">
        <div className="logo">{shopInfo}</div>
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </header>
      <div className="container">
        <nav className="sidebar">
          <ul>
            <li>
              <div onClick={() => handleSubmenuClick("orders")}>Orders</div>
            </li>

            <li onClick={() => handleSubmenuClick("Customers")}>Customers</li>

            <li onClick={() => handleSubmenuClick("Prices")}>Prices</li>

            <li onClick={() => handleSubmenuClick("ShopDetails")}>
              Shop Details
            </li>

            <li onClick={() => handleSubmenuClick("AccountDetails")}>
              Account Details
            </li>
          </ul>
        </nav>
        {tableContent === "orders" && (
          <OrderTable tableContent={tableContent} tableData={allOrders} />
        )}

        {tableContent === "Customers" && (
          <CustomerTable tableContent={tableContent} tableData={customers} />
        )}

        {tableContent === "Prices" && <Prices price={CompnayPrices} />}
        {tableContent === "ShopDetails" && <ShopDetails />}

        {tableContent === "AccountDetails" && (
          <AccountDetails email={email} password={password} />
        )}

      </div>
    </div>
  );
};

export default Dashboard;

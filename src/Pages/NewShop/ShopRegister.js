import React, { useState } from "react";
import "./ShopRegister.css";
import Cookies from "js-cookie";

import GetCompanyData from "../../graphql/Query/GetCompany";
import { useNavigate } from "react-router-dom";
import GetPrices from "../../graphql/Query/GetPrices";
const ShopRegister = () => {
  const navigate = useNavigate();
  const [shopId, setShopId] = useState(null);

  const { hasCompany, companyData, loading, error } = GetCompanyData();
  const { prices, Priceloading, Priceerror } = GetPrices(shopId);

  const handleSelect = (e) => {
    const selected = parseInt(e.target.value);
    setShopId(selected);
  };

  const handleContinue = (e) => {
    e.preventDefault();
    Cookies.set("shopId", JSON.stringify(shopId));
    if (prices) {
      navigate("/dashboard");
    }
    Cookies.set(
      "shopName",
      companyData.find((company) => company.id === shopId).companyName
    );
    Cookies.set(
      "shopAddress",
      companyData.find((company) => company.id === shopId).companyAddress
    );
  };
  if (hasCompany) {
    return (
      <div className="newshop-container">
        <div className="newshop-head">
          <h2>You have already registered a shop</h2>
        </div>

        <div className="newshop-registerform">
          <label htmlFor="shopname">Select shop</label>
          <select
            id="shopname"
            name="shopname"
            required
            onChange={handleSelect}
          >
            <option value="">Select Shop</option>

            {companyData.map((company) => (
              <option key={company.id} value={company.id}>
                {company.companyName}
              </option>
            ))}
          </select>

          <button type="submit" onClick={handleContinue}>
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="shopregister-container">
      <div className="shopregister-head">
        <h2>Register Your Shop Here</h2>
      </div>

      <div className="shop-registerform">
        <label htmlFor="shopname">Shop Name</label>

        <input type="text" id="shopname" name="shopname" required />

        <label htmlFor="Shop Address">Shop Address</label>

        <input type="text" id="shopaddress" name="shopaddress" required />

        <button type="submit">Register</button>
      </div>
    </div>
  );
};

export default ShopRegister;

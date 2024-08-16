import React from 'react';
import Cookies from 'js-cookie';
import AccountDetailsImage from "../../Assets/account-details.svg";
import './AccountDetails.css';

// In AccountDetails functional component, we will receive email & password as a props & later on we will render them into the account details content
const AccountDetails = ({ email, password }) => {
  // retrieving the values of shopName & shopAddress from the cookies
  const shopName = Cookies.get('shopName');
  const shopAddress = Cookies.get('shopAddress');

  return (
    // Account details content
    <div className="accountdetails-content">
      <div className="accountdetails-info">
      {/* Account details */} 
      <h2><u>Account Details</u></h2>
      <p><strong>Account Holder's Name:-</strong> Test User</p>
      <p><strong>Email Address:-</strong> {email}</p>
      <p><strong>Password:-</strong> {password}</p>
      <p><strong>Mobile Number:-</strong> +1 (519) 777-8989</p>
      <hr></hr>
      <p>This account have shops listed below:-</p>
      <p><strong>Shop Name:-</strong> {shopName}</p>
      <p><strong>Shop Address:-</strong> {shopAddress}</p>
      </div>
      {/* Account details image */}  
      <img src={AccountDetailsImage} alt="accountDetailsImage" />
    </div>
  );
};

export default AccountDetails;

// Reference for account-details.svg or AccountDetailsImage, it is taken & downloaded from https://undraw.co/illustrations & https://undraw.co/search

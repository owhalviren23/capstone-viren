import React from 'react';
import Cookies from 'js-cookie';
import ShopDetailsImage from "../../Assets/shop-details.svg";
import './ShopDetails.css';

const ShopDetails = () => {
  // retrieving the value of shopName & shopAddress from the cookies
  const shopName = Cookies.get('shopName');
  const shopAddress = Cookies.get('shopAddress');

  return (
    // Shop details content
    <div className="shopdetails-content">
      {/* Shop details image */}  
      <img src={ShopDetailsImage} alt="shopDetailsImage" />
      <div className="shopdetails-info">
      {/* Shop details */} 
      <h2><u>Tailor's Shop Details</u></h2>
      <p><strong>Shop Name:-</strong> {shopName}</p>
      <p><strong>Shop Address:-</strong> {shopAddress}</p>
      <p><strong>Shop Email Id:-</strong> democompany@gmail.com</p>
      <p><strong>Shop Phone No:-</strong> +1 (519) 777-8989</p>
      <p><strong>Shop WhatsApp No:-</strong> +1 (519) 777-8181</p>
      <p><strong>Shop Registration No:-</strong> THS437SBSH</p>
      </div>
    </div>
  );
};

export default ShopDetails;

// Reference for shop-details.svg or ShopDetailsImage, it is taken & downloaded from https://undraw.co/illustrations & https://undraw.co/search

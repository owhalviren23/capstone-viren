import React, { useState } from "react";
import "./Price.css";
import { UPDATE_PRICE } from "../../graphql/Mutation/UpdatePrice";
import { useMutation } from "@apollo/client";
const Prices = (props) => {
  const pricesData = props?.price?.prices;
  console.log(pricesData);

  const [UpdatePriceData] = useMutation(UPDATE_PRICE, {
    onCompleted: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const [formData, setFormData] = useState({
    shirt: pricesData?.shirtPrice || 0,
    pant: pricesData?.pantPrice || 0,

    sherwani: pricesData?.sherwaniPrice || 0,
    suit: pricesData?.suitPrice || 0,
    coat: pricesData?.coatPrice || 0,
  });

  const handleChange = (e) => {
    console.log(e.target.value);
    console.log(e.target.name);
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseInt(value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("wewe", formData);
    const newPriceData = {
      companyId: props?.price?.prices?.companyId,

      shirtPrice: formData.shirt,
      pantPrice: formData.pant,
      sherwaniPrice: formData.sherwani,
      suitPrice: formData.suit,
      coatPrice: formData.coat,
      updatedAt: new Date().toISOString(),
    };
    console.log(newPriceData);
    UpdatePriceData({
      variables: { ...newPriceData },
    });
  };

  return (
    <>
      <div className="price-form-container">
        <h1 className="price-form-title">Prices</h1>
        <form onSubmit={handleSubmit}>
          <label className="price-form-label" htmlFor="shirt">
            Shirt
          </label>
          <input
            type="number"
            id="shirt"
            name="shirt"
            value={formData.shirt}
            onChange={handleChange}
            className="price-form-input"
          />

          <label className="price-form-label" htmlFor="pant">
            Pant
          </label>
          <input
            type="number"
            id="pant"
            name="pant"
            value={formData.pant}
            onChange={handleChange}
            className="price-form-input"
          />

          <label className="price-form-label" htmlFor="sherwani">
            Sherwani
          </label>
          <input
            type="number"
            id="sherwani"
            name="sherwani"
            value={formData.sherwani}
            onChange={handleChange}
            className="price-form-input"
          />

          <label className="price-form-label" htmlFor="suit">
            Suit
          </label>
          <input
            type="number"
            id="suit"
            name="suit"
            value={formData.suit}
            onChange={handleChange}
            className="price-form-input"
          />

          <label className="price-form-label" htmlFor="coat">
            Coat
          </label>
          <input
            type="number"
            id="coat"
            name="coat"
            value={formData.coat}
            onChange={handleChange}
            className="price-form-input"
          />

          <button type="submit" className="price-form-button">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Prices;

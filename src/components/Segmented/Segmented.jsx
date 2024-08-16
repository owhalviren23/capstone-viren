import React, { useState } from "react";
import "./Segmented.css";

const Segmented = ({ options, onChange }) => {
  const [selected, setSelected] = useState(options[0]);

  const handleClick = (value) => {
    setSelected(value);
    onChange(value);
  };

  return (
    <div className="segmented-container">
      {options.map((option) => (
        <div
          key={option}
          className={`segment ${selected === option ? "selected" : ""}`}
          onClick={() => handleClick(option)}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

export default Segmented;

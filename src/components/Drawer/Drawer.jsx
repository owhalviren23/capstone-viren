// Drawer.js
import React, { Children, useEffect, useRef } from "react";
import "./Drawer.css";

const Drawer = ({ isOpen, onClose, id, children }) => {
  const drawerRef = useRef();

  const handleClickOutside = (event) => {
    if (drawerRef.current && !drawerRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      className={`drawer ${isOpen ? "open" : ""}`}
      id={`drawer-${id}`}
      ref={drawerRef}
    >
      <div className="drawer-content">{children}</div>
    </div>
  );
};

export default Drawer;

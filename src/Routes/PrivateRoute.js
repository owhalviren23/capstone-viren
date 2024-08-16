import Cookies from "js-cookie";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = Cookies?.get("jwtToken");

  return token ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;

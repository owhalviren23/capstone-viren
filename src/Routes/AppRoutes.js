import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "../Pages/SignUp/Signup";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../Pages/Dashboard/Dashboard";
import ShopRegister from "../Pages/NewShop/ShopRegister";
import LoginPage from "../Pages/LoginPage/LoginPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* This is our Starting Page */}

      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/registerShop" element={<ShopRegister />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

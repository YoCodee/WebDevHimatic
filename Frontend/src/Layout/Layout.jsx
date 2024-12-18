import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";

const Layout = () => {
  return (
    <div className="bg-[#f4f2ec] overflow-y-hidden">
      <div className="wrapper  font-montserrat">
        <Outlet />
  
      </div>
    </div>
  );
};

export default Layout;

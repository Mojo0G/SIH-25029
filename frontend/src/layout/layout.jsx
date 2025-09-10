import { Outlet } from "react-router-dom";
import { Navbar1 } from "../components/navbar1";

export const MainLayout = () => {
  return (
    <>
    <Navbar1/>

      <Outlet />

      <div>footer</div>
    </>
  );
};

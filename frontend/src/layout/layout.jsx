import { Outlet } from "react-router-dom";
import { Navbar1 } from "../components/navbar1";
import Footer from '../components/footer'

export const MainLayout = () => {
  return (
    <>
    <Navbar1/>

      <Outlet />

      <Footer/>
    </>
  );
};

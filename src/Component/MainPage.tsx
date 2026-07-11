import { ToastContainer } from "react-toastify";
import Navbar from "../Helper/Navbar";
import { Outlet } from "react-router-dom";

const MainPage=()=>{
    return<div>
        <Navbar/>
        <Outlet/>
        <ToastContainer autoClose={5000} position="top-right"/>
    </div>
}
export default MainPage;
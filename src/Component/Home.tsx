import Navbar from "../Helper/Navbar";
import { Outlet } from "react-router-dom";

const Home=()=>{
    return<div>
        <Navbar/>
        <Outlet/>
    </div>
}
export default Home;
import {createBrowserRouter, Router, RouterProvider,Outlet} from "react-router-dom";
import Login from "./Component/Login";
import Home from "./Component/Home";
import Signup from "./Component/SIgnup";
import Booking from "./Component/Booking";

const Routing=createBrowserRouter([{
  path:"/",
  element:<Home/>,
  children:[

    {
      path:"/login",
      element:<Login/>
    },
    {
      path:"/signup",
      element:<Signup/>
    },
    {
      path:"/booking",
      element:<Booking/>
    }
]
}])
const App=()=>{
  return <RouterProvider router={Routing}>
    <Outlet/>
  </RouterProvider>
}
export default App;
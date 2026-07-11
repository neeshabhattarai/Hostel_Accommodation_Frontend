import { createBrowserRouter } from "react-router-dom";
import Login from "./Component/Login";
import MainPage from "./Component/MainPage";
import Signup from "./Component/SIgnup";

import {ProtectedRoute,AdminProtectedRoute} from "./Component/ProtectedRoute";
import { GetAllRoom } from "./api/RoomApi";
import GetAllRoomUI from "./Component/Room/GetAllRoom";
import PaymentSuccessPage from "./Component/payment/PaymentSuccessPage";
import HostelMain from "./Component/Hostel/HostelMain";
import HomePage from "./Component/HostelHome/HomePage";
import {BookingDetailTableForUser} from "./Component/Room/BookingTable";
import BookingApp from "./Booking/Admin/BookingApp";
import HostelDashboard from "./Booking/Admin/Dashboard/HostelDashboard";
import { bookingApi } from "./api/Booking";
import RoomManagement from "./Component/Room/RoomUI";
import ProfileEdit from "./Component/Profile/ProfileEdit";
import ProfileView from "./Component/Profile/ProfileView";
import PageNotFound from "./Component/pagenotfound/PageNotFound";
import Contact from "./Component/Contact";
import About from "./Component/About";
export const Routing = createBrowserRouter([
  {
    path: "/",
    Component: MainPage,
    errorElement:<PageNotFound/>,
    children: [
      {
        index:true,
        Component:HomePage
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "signup",
        Component: Signup,
      },
      {
        path: "allroom",
        loader:async()=>{
          const room=await GetAllRoom().then(res=>res.data);
          return room._data;
        },
        element:<AdminProtectedRoute>
          <RoomManagement/>
        </AdminProtectedRoute>,
      },
      {
        path: "room",
        loader:async()=>{
          const res=await GetAllRoom();
          return res?.data?._data ?? [];
        },
        Component:GetAllRoomUI,

      },
    
      {
        path: "dashboard",
        element: (
          <AdminProtectedRoute>
            <HostelDashboard/>
          </AdminProtectedRoute>
        ),
        loader:async()=>{
          const rooms=await GetAllRoom().then((res)=>res.data);
          console.log(rooms);
          const bookings=await bookingApi.getAll().then(res=>res._data);
          return {
            rooms:rooms._data,
            bookings
          }
        }
      },
      {
        path: "booking",
        element: (
          <ProtectedRoute>
            <BookingDetailTableForUser />
          </ProtectedRoute>
        ),
      },
      {
        path: "allbooking",
        element: (
          <AdminProtectedRoute>
            <BookingApp />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "profile/edit",
        element: (
          <ProtectedRoute>
            <ProfileEdit />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfileView />
          </ProtectedRoute>
        ),
      },
      {
        path:"payment/success",
        Component:PaymentSuccessPage
      },
      {
        path:"hostel",
        element:<AdminProtectedRoute>
          <HostelMain/>
        </AdminProtectedRoute>
      },
      {path:"/contact",
        element:<Contact/>
      },
      {path:"/about",
        element:<About/>
      }
    ],
  },
]);

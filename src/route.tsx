import { createBrowserRouter } from "react-router-dom";
import Login from "./Component/Login";
import MainPage from "./Component/MainPage";
import Signup from "./Component/SIgnup";

import {ProtectedRoute,AdminProtectedRoute} from "./Component/ProtectedRoute";
import { GetAllRoom, GetAllRooms } from "./api/RoomApi";
import GetAllRoomUI from "./Component/Room/GetAllRoom";
import PaymentSuccessPage from "./Component/payment/PaymentSuccessPage";
import HostelMain from "./Component/Hostel/HostelMain";
import HomePage from "./Component/HostelHome/HomePage";
import {BookingDetailTableForUser} from "./Component/Room/BookingTable";
import BookingApp from "./Booking/Admin/BookingApp";
import HostelDashboard from "./Booking/Admin/Dashboard/HostelDashboard";
import RoomManagement from "./Component/Room/RoomUI";
import ProfileEdit from "./Component/Profile/ProfileEdit";
import ProfileView from "./Component/Profile/ProfileView";
import PageNotFound from "./Component/pagenotfound/PageNotFound";
import Contact from "./Component/Contact";
import About from "./Component/About";
import { bookingApi } from "./api/Booking";
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
          const res=await GetAllRooms();      
          return res?.data?? [];
        },
        element:<AdminProtectedRoute>
          <RoomManagement/>
        </AdminProtectedRoute>,
      },
      {
        path: "room",
        loader:async({request})=>{
          const url = new URL(request.url);
          const pageNumber = Number(url.searchParams.get("pageNumber") ?? 1);
          const pageSize = Number(url.searchParams.get("pageSize") ?? 12);
          const res=await GetAllRoom(pageNumber,pageSize);
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
          const res=await GetAllRooms();
          const bookings=await bookingApi.getAllBookings();
          console.log(bookings);
          return {
            rooms:res?.data??[],
            bookings:bookings??[],
          };
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
      {path:"contact",
        element:<Contact/>
      },
      {path:"about",
        element:<About/>
      }
    ],
  },
]);

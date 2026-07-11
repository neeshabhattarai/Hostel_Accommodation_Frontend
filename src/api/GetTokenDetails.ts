
import { useAuthStore } from "../auth/Authentication";
export default function GetToken(){
    const token=useAuthStore.getState().token;
   

    const isAuthenticated=useAuthStore.getState().isAuthenticated;
  
    
     return {token,isAuthenticated};
    }
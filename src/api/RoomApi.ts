import axios from "axios";
import BaseUrl from "./BaseUrl";
import GetToken from "./GetTokenDetails";
import { getAuthConfig } from "./Booking";

async function PostRoom({body}:{body:FormData}) {
    const{token,isAuthenticated}=GetToken();
    if(isAuthenticated()){
   const response= axios.post(BaseUrl+"/Room/CreateRoom",body,{
        headers:{
            "Authorization":`Bearer ${token}`
        }
    })

    return response;
}
}

async function GetAllRoom() {

   const response=await axios.get(BaseUrl+"/Room/GetAllRooms?pageSize=10&pageIndex=1",{
        headers:{
            "Content-Type":"application/json"
        }
    })
    return response;

}

async function DeleteRoom(id:string) {
    const headers=getAuthConfig();
    const response=await axios.delete(BaseUrl+`/Room/DeleteRoom/${id}`,{
         ...headers
     })
     return response;
 
 }
 async function FindBestRoomApi(body:any) {
    const response=await axios.post(BaseUrl+"/Room/FindBestRoom",body,{
headers:{
    "Content-Type":"application/json"
}
     })
     return response;
 }
export {PostRoom,GetAllRoom,DeleteRoom,FindBestRoomApi};
import React, { useEffect, useState } from "react";
import {GetAllRoom} from "../../../api/RoomApi"
import type { Room } from "../../../types/room";
import RoomCard from "../../Room/RoomCard";

const RoomsSection= () => {
  const [displayRoom,setRooms]=useState<Room[]>([]);
  useEffect(()=>{
    const fetchRoom=async()=>{
  const allRoom=(await GetAllRoom()).data._data;
  setRooms(allRoom);
    };
    fetchRoom();

  },[])
  if(displayRoom==undefined){
    return <h1> loading....</h1>
  }
  const today=new Date();
  today.setHours(0,0,0,0);
  const filterRoom=displayRoom.filter((v)=>{
    const isOccupied=v.bookings.some((y)=>{
  const checkIn=new Date(y.check_In_Date);
  checkIn.setHours(0,0,0,0);
  const checkOut=new Date(y.check_Out_Date);
  checkOut.setHours(0,0,0,0);
return (today>=checkIn && today<checkOut);
  })
  return isOccupied;
});
 const rooms=filterRoom.length==0?[]:filterRoom;
  
  return(
  <section className="bg-gray-50 border-t border-gray-100 py-20">
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center mb-12">
        <span className="text-xs font-bold tracking-widest uppercase text-indigo-500">
          Accommodation
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
          Pick your perfect room.
        </h2>
      </div>
      {rooms.length==0?<p className="text-red-500 justify-center  text-xl font-bold">Currently room not available</p>:<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rooms.slice(0,3).map((r: Room) => (
          <RoomCard room={r} />
        ))}
      </div>}
    </div>
  </section>
);
}

export default RoomsSection;

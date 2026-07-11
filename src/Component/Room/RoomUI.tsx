import { useState } from "react";
import CreateRoom from "./CreateRoom";
import { useLoaderData } from "react-router-dom";
import { DeleteRoom } from "../../api/RoomApi";
import { toast } from "react-toastify";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Home, 
  Bed, 
  DollarSign,
  Circle,
  Search,
  Users,
  X
} from "lucide-react";

interface Room {
  room_Id: string | number;
  room_Type?: string;
  room_Price?: number;
  room_Status?: string;
  currentOccupancy?: number;
  capacity?: number;
}

export default function RoomManagement() {
  const room = useLoaderData<Room[]>();
  const [rooms, setRooms] = useState(room || []);
  const [openCreate, setOpenCreate] = useState(false);
  const [editRoom, setEditRoom] = useState<Room | null>(null);
  const [deleteRoom, setDeleteRoom] = useState<Room | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id: string) => {
    const res = await DeleteRoom(id);
    setRooms(r => r.filter(r => r.room_Id != id));
    if (res.status) {
      toast.success("Successfully deleted");
    }
    setDeleteRoom(null);
  };

  /* ---------------- FILTER ROOMS ---------------- */
  const filteredRooms = rooms.filter(room => 
    room.room_Type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.room_Id?.toString().includes(searchTerm)
  );

  /* ---------------- STATUS BADGE ---------------- */
  const getStatusBadge = (status?: string) => {
    const statusMap = {
      available: { color: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
      occupied: { color: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-500" },
      maintenance: { color: "bg-red-100 text-red-700 border-red-200", dot: "bg-red-500" },
      reserved: { color: "bg-blue-100 text-blue-700 border-blue-200", dot: "bg-blue-500" },
    };
    const defaultStatus = { color: "bg-gray-100 text-gray-700 border-gray-200", dot: "bg-gray-500" };
    const statusKey = status?.toLowerCase() as keyof typeof statusMap;
    const selected = statusMap[statusKey] || defaultStatus;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${selected.color}`}>
        <Circle className={`w-1.5 h-1.5 ${selected.dot} fill-current`} />
        {status || "Unknown"}
      </span>
    );
  };

  /* ---------------- GET ROOM ICON ---------------- */
  const getRoomIcon = (type?: string) => {
    const typeMap: Record<string, React.ReactNode> = {
      "single": <Bed className="w-4 h-4" />,
      "double": <Bed className="w-4 h-4" />,
      "suite": <Home className="w-4 h-4" />,
      "deluxe": <Home className="w-4 h-4" />,
    };
    return typeMap[type?.toLowerCase() || ""] || <Bed className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen mt-8 bg-gradient-to-br from-slate-50 to-slate-100/50 p-6">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              Room Management
              <span className="text-sm font-normal text-slate-500 bg-slate-200/50 px-3 py-1 rounded-full ml-2">
                {rooms.length} Rooms
              </span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">Manage your hotel rooms and availability</p>
          </div>

          <button
            onClick={() => setOpenCreate(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg hover:shadow-indigo-200/50"
          >
            <Plus className="w-4 h-4" />
            Add New Room
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by room number or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ROOM GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredRooms.map((room) => (
            <div
              key={room.room_Id}
              className="group bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Room Image Placeholder */}
              <div className="relative h-32 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl mb-4 flex items-center justify-center">
                <div className="text-4xl opacity-30">🏨</div>
                <div className="absolute top-2 right-2">
                  {getStatusBadge(room.room_Status)}
                </div>
                <div className="absolute bottom-2 left-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium text-slate-600">
                  Room #{room.room_Id}
                </div>
              </div>

              {/* Room Details */}
              <div className="space-y-2">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
        {getRoomIcon(room.room_Type)}
      </div>
      <p className="font-semibold text-slate-800 capitalize">
        {room.room_Type || "Standard"}
      </p>
    </div>
  </div>

  <div className="flex items-center gap-1 text-teal-600">
    <DollarSign className="w-4 h-4" />
    <span className="text-lg font-bold">NPR {room.room_Price?.toLocaleString()}</span>
    <span className="text-xs text-slate-400 font-normal">/ night</span>
  </div>

  {/* Occupancy / Capacity */}
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-1.5 text-slate-500">
      <Users className="w-3.5 h-3.5" />
      <span className="text-xs font-medium">
        {room.currentOccupancy ?? 0} / {room.capacity ?? 0} occupied
      </span>
    </div>
    {room.capacity > 0 && (
      <span
        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          (room.currentOccupancy ?? 0) >= room.capacity
            ? "bg-red-50 text-red-600"
            : (room.currentOccupancy ?? 0) / room.capacity >= 0.75
              ? "bg-amber-50 text-amber-600"
              : "bg-emerald-50 text-emerald-600"
        }`}
      >
        {Math.round(((room.currentOccupancy ?? 0) / room.capacity) * 100)}%
      </span>
    )}
  </div>

  {/* Action Buttons */}
  <div className="flex gap-2 pt-3 border-t border-slate-100">
    <button
      onClick={() => setEditRoom(room)}
      className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 rounded-xl transition-all"
    >
      <Edit className="w-3.5 h-3.5" />
      Edit
    </button>
    <button
      onClick={() => setDeleteRoom(room)}
      className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 rounded-xl transition-all"
    >
      <Trash2 className="w-3.5 h-3.5" />
      Delete
    </button>
  </div>
</div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredRooms.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-lg font-semibold text-slate-700">No rooms found</h3>
            <p className="text-sm text-slate-500 mt-1">
              {searchTerm ? "Try adjusting your search" : "Start by adding your first room"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* ---------------- CREATE MODAL ---------------- */}
        {openCreate && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
              <div className="sticky top-0 bg-white/90 backdrop-blur-sm p-6 border-b border-slate-200/80 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Add New Room</h2>
                <button
                  onClick={() => setOpenCreate(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="p-6">
                <CreateRoom
                  onSuccess={(newRoom: Room) => {
                    setRooms(prev => [...prev, newRoom]);
                    setOpenCreate(false);
                  }}
                  onCancel={() => setOpenCreate(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* ---------------- EDIT MODAL ---------------- */}
        {editRoom && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
              <div className="sticky top-0 bg-white/90 backdrop-blur-sm p-6 border-b border-slate-200/80 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Edit Room</h2>
                <button
                  onClick={() => setEditRoom(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="p-6">
                <CreateRoom
                  editData={editRoom}
                  onSuccess={(updated: Room) => {
                    setRooms(prev =>
                      prev.map(r =>
                        r.room_Id === updated.room_Id ? updated : r
                      )
                    );
                    setEditRoom(null);
                    toast.success("Room updated successfully");
                  }}
                  onCancel={() => setEditRoom(null)}
                />
              </div>
            </div>
          </div>
        )}

        {/* ---------------- DELETE MODAL ---------------- */}
        {deleteRoom && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
              <div className="p-6">
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-50 rounded-2xl mb-4">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 text-center">
                  Delete Room?
                </h2>
                <p className="text-sm text-slate-500 text-center mt-2">
                  Room #{deleteRoom.room_Id} will be permanently deleted.
                  <br />
                  This action cannot be undone.
                </p>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setDeleteRoom(null)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-xl transition-all"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => handleDelete(deleteRoom.room_Id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 rounded-xl transition-all shadow-lg shadow-red-200/50"
                  >
                    Delete Room
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
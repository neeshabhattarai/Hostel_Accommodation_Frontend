import { useState, useEffect, useRef, useCallback } from "react";
import type {
  Hostel,
  HostelFormValues,
  ModalState,
  ToastState,
  ApiState,
} from "../types/hostel";
import { hostelApi } from "../api/hostelApi";

export function useHostels() {
  const [rows, setRows] = useState<Hostel[]>([]);
  const [apiState, setApiState] = useState<ApiState>("loading");
  const [apiError, setApiError] = useState<string | null>(null);

  const [modal, setModal] = useState<ModalState>(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<ToastState>(null);

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string, variant: "success" | "danger" = "success") => {
    setToast({ msg, variant });

    if (toastTimer.current) clearTimeout(toastTimer.current);

    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  // ✅ FETCH
  const fetchHostels = useCallback(async () => {
    try {
      setApiState("loading");
      setApiError(null);

      const response = await hostelApi.getAll();
      // console.log("API Response:", response);

      let hostels: Hostel[] = [];

      if (response) {
        hostels = response;
      } else {
        // console.error("Invalid API format:", response);
        hostels = [];
      }

      setRows(hostels);
      setApiState("idle");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to load hostels");
      setRows([]);
      setApiState("error");
    }
  }, []);

  useEffect(() => {
    const fetchHostel=async()=>{
     await fetchHostels();
    }
    fetchHostel();

    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, [fetchHostels]);

  // ✅ SEARCH (FIXED → no crash ever)
  const filtered = (Array.isArray(rows) ? rows : []).filter((r) => {
    const searchText = search.toLowerCase();

    return (
      (r.name ?? "").toLowerCase().includes(searchText) ||
      String(r.hostelId ?? "").toLowerCase().includes(searchText) ||
      (r.phoneNumber ?? "").includes(search)
    );
  });

  // ✅ ADD
  const handleAdd = async (data: HostelFormValues) => {
    try {
      const created = await hostelApi.create(data);
      setRows((prev) => [...prev, created]);
      setModal(null);
      showToast("Hostel added successfully");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to create hostel", "danger");
    }
  };

  // ✅ EDIT (hostelId FIXED)
  const handleEdit = async (data: HostelFormValues) => {
    if (!modal || modal.type !== "edit") return;

    try {
      const updated = await hostelApi.update(modal.row.hostelId, data);

      setRows((prev) =>
        prev.map((r) =>
          r.hostelId === modal.row.hostelId ? updated : r
        )
      );

      setModal(null);
      showToast("Hostel updated successfully");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update hostel", "danger");
    }
  };

  // ✅ DELETE
  const handleDelete = async () => {
    if (!modal || modal.type !== "delete") return;

    try {
      await hostelApi.remove(modal.row.hostelId);

      setRows((prev) =>
        prev.filter((r) => r.hostelId !== modal.row.hostelId)
      );

      setModal(null);
      showToast("Hostel deleted", "danger");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to delete hostel", "danger");
    }
  };

  return {
    rows,
    filtered,
    apiState,
    apiError,
    refetch: fetchHostels,

    modal,
    setModal,

    search,
    setSearch,

    toast,

    handleAdd,
    handleEdit,
    handleDelete,
  };
}
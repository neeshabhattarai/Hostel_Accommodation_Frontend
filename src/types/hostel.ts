export type Hostel = {
    hostelId: string;
    name: string;
    address: string;
    phoneNumber: string;
  };
  
  export type HostelFormValues = Omit<Hostel, "id">;
  
  export type ModalState =
    | { type: "add" }
    | { type: "edit"; row: Hostel }
    | { type: "delete"; row: Hostel }
    | null;
  
  export type ToastState = {
    msg: string;
    variant: "success" | "danger";
  } | null;

  export type ApiState = "loading" | "idle" | "error";
  
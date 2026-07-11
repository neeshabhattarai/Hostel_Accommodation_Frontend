interface Props {
    status: "Available" |"Occupied"| "Booked" | "Maintenance";
  }
  
  export default function StatusBadge({ status }: Props) {
    const map = {
      Available: "badge-available",
      Occupied: "badge-occupied",
      Booked: "badge-booked",

      Maintenance: "badge-maintenance",
    } as const;
  
    return (
      <span className={`badge ${map[status]}`}>
        {status}
      </span>
    );
  }
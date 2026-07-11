interface Props {
    label: string;
    value: string | number;
  }
  
  export default function Row({
    label,
    value,
  }: Props) {
    return (
      <div className="flex justify-between">
        <span>{label}</span>
        <span>{value}</span>
      </div>
    );
  }
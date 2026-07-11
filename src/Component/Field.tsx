interface Props {
    label: string;
    error?: string;
    children: React.ReactNode;
  }
  
  export default function Field({
    label,
    error,
    children,
  }: Props) {
    return (
      <div className="flex flex-col gap-2">
        <label className="font-semibold">{label}</label>
  
        {children}
  
        {error && (
          <p className="text-red-500 text-sm">
            {error}
          </p>
        )}
      </div>
    );
  }
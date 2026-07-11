interface Props {
    title: string;
    children: React.ReactNode;
  }
  
  export default function Card({
    title,
    children,
  }: Props) {
    return (
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="font-bold mb-4">{title}</h2>
  
        {children}
      </div>
    );
  }
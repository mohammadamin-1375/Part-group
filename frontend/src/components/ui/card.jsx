export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-xl bg-zinc-800 p-4 shadow-md ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

interface StatCardProps {
  label: string;
  value: string | number;
  color?: string;
  bg?: string;
  border?: string;
}

export default function StatCard({
  label,
  value,
  color = "#166534",
  bg = "#dcfce7",
  border = "#bbf7d0",
}: StatCardProps) {
  return (
    <div
      className="px-6 py-5 rounded-lg transition-transform hover:-translate-y-0.5"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      <div
        className="text-xs mb-2 tracking-wider"
        style={{ color, opacity: 0.8 }}
      >
        {label.toUpperCase()}
      </div>
      <div className="text-3xl font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

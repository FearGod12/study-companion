import { StatCardProps } from "@/interfaces/interface";

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  bgColor = "bg-accent",
}) => (
  <div
    className={`flex items-center justify-between p-4 rounded-lg shadow-md ${bgColor} text-gray-100 text-sm`}
  >
    <div className="flex items-center gap-4">
      <div className="rounded-full bg-white/20 p-3 flex items-center justify-center text-xl">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold break-words">{label}</h3>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

export default StatCard;

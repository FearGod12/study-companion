import PropTypes from "prop-types";

const StatCard = ({ icon, label, value, bgColor }) => (
  <div
    className={`flex items-center justify-between p-4 rounded-lg shadow-md ${bgColor} text-gray-100 text-sm`}
  >
    <div className="flex items-center gap-4">
      <div className="rounded-full bg-gray-100/20">{icon}</div>
      <div>
        <h3 className="text-sm font-semibold flex text-wrap">{label}</h3>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

StatCard.propTypes = {
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  bgColor: PropTypes.string.isRequired,
};

export default StatCard
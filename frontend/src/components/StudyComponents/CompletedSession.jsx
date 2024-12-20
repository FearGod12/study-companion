import Button from "../common/Button";
import PropTypes from 'prop-types';

const CompletedSession = ({ navigate }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-gray-100">
    <h1 className="text-3xl font-bold mb-4">Session Completed!</h1>
    <p className="text-lg mb-6">You did amazing work today 🎉</p>
    <div className="flex gap-4">
      <Button
        onClick={() => navigate("/dashboard")}
        className="px-6 py-3 bg-green-500 text-white rounded-lg"
        text="Back to Dashboard"
      />
    </div>
  </div>
  );
};

CompletedSession.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default CompletedSession;
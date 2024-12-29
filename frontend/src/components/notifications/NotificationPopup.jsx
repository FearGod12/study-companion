import { X } from 'lucide-react';
import PropTypes from 'prop-types';

export const NotificationPopup = ({ message, onRespond }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 p-4 bg-white shadow-lg rounded-lg animate-in fade-in slide-in-from-bottom-5">
      <div className="flex items-start justify-between">
        <h2 className="text-lg font-semibold">Study Check-in</h2>
        <button
          onClick={() => onRespond(false)}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <p className="mt-2 text-gray-700">{message}</p>
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={() => onRespond(true)}
          className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600"
        >
          Yes, still studying!
        </button>
      </div>
    </div>
  );
};

NotificationPopup.propTypes = {
  message: PropTypes.string.isRequired,
  onRespond: PropTypes.func.isRequired,
};

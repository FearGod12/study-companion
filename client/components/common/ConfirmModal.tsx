import PropTypes from 'prop-types';

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/90 z-50">
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-sm mx-2">
        <h2 className="lg:text-lg md:text-base text-base font-semibold mb-4">{message}</h2>
        <div className="flex justify-end gap-4 lg:text-base md:text-base text-sm">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-red-500 text-gray-100 rounded font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-500 text-gray-700 font-semibold rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// Prop validation
ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,     
  message: PropTypes.string.isRequired,   
  onConfirm: PropTypes.func.isRequired,   
  onCancel: PropTypes.func.isRequired,    
};

export default ConfirmationModal;

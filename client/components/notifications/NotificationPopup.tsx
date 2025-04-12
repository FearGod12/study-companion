import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
interface NotificationPopupProps {
  message: string; 
  onRespond: (response: boolean) => void;
  timeout?: number;
}

export const NotificationPopup = ({ message, onRespond, timeout = 120 }: NotificationPopupProps) => {
  const [timeLeft, setTimeLeft] = useState(timeout);

  useEffect(() => {
    // Start the countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer); 
          onRespond(false); 
          return 0;
        }
        return prev - 1; 
      });
    }, 1000);

    return () => clearInterval(timer); 
  }, [onRespond]);

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
      <div className="mt-2">
        <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
          <div
            className="bg-blue-500 h-full transition-all duration-1000 ease-linear"
            style={{ width: `${(timeLeft / timeout) * 100}%` }} 
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')} remaining
        </p>
      </div>
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

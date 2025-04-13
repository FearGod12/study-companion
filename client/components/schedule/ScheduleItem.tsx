import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import Button from "@/components/common/Button";
import useSchedules from "@/hooks/useSchedules";
import { Schedule } from "@/interfaces/interface";

const ScheduleItem: React.FC<{ schedule: Schedule }> = ({ schedule }) => {
  const { openModal, formatTitle, formatDate, formatTime, loading } =
    useSchedules();

  return (
    <li className="flex justify-between items-center p-4 rounded-lg bg-accent text-gray-100">
      <div>
        <h3 className="text-lg font-semibold">{formatTitle(schedule.title)}</h3>
        <p className="text-sm">
          {formatDate(schedule.startDate)} - {formatTime(schedule.startTime)}
        </p>
        <p>{schedule.duration} minutes</p>
        {schedule.isRecurring && (
          <p className="text-xs italic text-yellow-100">Recurring</p>
        )}
        <Button
          onClick={() => openModal(schedule, "start")}
          disabled={loading}
          className={`text-gray-100 border mt-2 px-2 py-2 
       
          `}
          text="Start Session"
        />
      </div>
      <div className="flex gap-2 items-center bg-gray-100 rounded p-2">
        <button
          onClick={() => openModal(schedule, "edit")}
          disabled={loading}
          className="text-blue-600 relative group"
        >
          <FaRegEdit size={20} />
          <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-max px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100">
            Edit
          </span>
        </button>

        <button
          onClick={() => openModal(schedule, "delete")}
          disabled={loading}
          className="text-red-500 relative group"
        >
          <RiDeleteBin6Line size={20} />
          <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-max px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100">
            Delete
          </span>
        </button>
      </div>
    </li>
  );
};

export default ScheduleItem;

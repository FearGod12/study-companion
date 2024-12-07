import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; 
import "../../styles/CustomCalendar.css";
import { FaCalendarCheck } from "react-icons/fa";
import { Link } from "react-router-dom";

const CustomCalendar = () => {
    const [date, setDate] = useState(new Date());

    return (
        <div className="flex h-full justify-between gap-2 lg:gap-3 md:gap-3 mx-2">
            <div className="items-center flex py-2">
                <Calendar
                    onChange={setDate}
                    value={date}
                    className="custom-calendar"
                />
            </div>
            <div className="pt-4">
                <Link to="/schedule">
                    <FaCalendarCheck size={24} color="#960057" />
                </Link>
            </div>
        </div>
    );
};

export default CustomCalendar;

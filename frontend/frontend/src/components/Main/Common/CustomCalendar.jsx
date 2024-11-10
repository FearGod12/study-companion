import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import the default CSS
import "../../../styles/CustomCalendar.css"

const CustomCalendar = () => {
    const [date, setDate] = useState(new Date());

    return (
        <div>
            <Calendar
                onChange={setDate}
                value={date}
                className="custom-calendar"
            />
        </div>
    );
};

export default CustomCalendar;

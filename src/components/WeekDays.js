import { addWeeks, format, startOfWeek } from "date-fns";
import React, { useState, useEffect } from "react";

const WeekDays = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimezone, setSelectedTimezone] = useState("UTC");
  const [weeklyData, setWeeklyData] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const [showFullWeek, setShowFullWeek] = useState(false);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const timeRange = Array.from({ length: 16 }, (_, i) => i + 8); // 8AM to 11PM

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/path/to/db.json");
        const data = await response.json();
        setWeeklyData(data.weeklyData);
        setScheduleData(data.scheduleData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDateChange = weeksToAdd => {
    setSelectedDate(addWeeks(selectedDate, weeksToAdd));
  };

  const handleTimezoneChange = event => {
    setSelectedTimezone(event.target.value);
  };

  const getWeeklyDataForDisplay = () => {
    const startOfWeekDate = showFullWeek
      ? startOfWeek(selectedDate)
      : selectedDate;
    return daysOfWeek.map((day, dayIndex) => {
      return {
        day,
        times: timeRange.map(hour => {
          const currentDate = addWeeks(startOfWeekDate, dayIndex);
          const checked =
            scheduleData.some(
              item =>
                item.day === day &&
                item.hour === hour &&
                item.date === format(currentDate, "yyyy-MM-dd") &&
                item.timezone === selectedTimezone
            ) || false;

          return {
            time: format(currentDate, "HH:mm XXXXX", {
              timeZone: selectedTimezone,
            }),
            checked,
          };
        }),
      };
    });
  };

  return (
    <div
      style={{
        width: "700px",
      }}
    >
      <div
        style={{
          width: "700px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <button onClick={() => handleDateChange(-1)}>Previous</button>
        <span>{format(selectedDate, "MMMM d, yyyy")}</span>
        <button onClick={() => handleDateChange(1)}>Next</button>
        <button onClick={() => setShowFullWeek(!showFullWeek)}>
          Show Full Week
        </button>
      </div>

      <div
        style={{
          width: "700px",
          display: "flex",
          gap: "100px",
        }}
      >
        <label>Timezone:</label>
        <select value={selectedTimezone} onChange={handleTimezoneChange}>
          <option value="UTC">UTC</option>
          <option value="UTC+2">UTC+2</option>
        </select>
      </div>

      <div
        style={{
          width: "700px",
        }}
      >
        {getWeeklyDataForDisplay().map(dayData => (
          <div
            key={dayData.day}
            style={{
              display: "flex",
              gap: "20px",
            }}
          >
            <span>{dayData.day}</span>
            {dayData.times.map((timeData, index) => (
              <label key={`${dayData.day}-${index}`}>
                <input type="checkbox" checked={timeData.checked} readOnly />
                {timeData.time}
              </label>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekDays;

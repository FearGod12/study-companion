import { useState, useEffect } from 'react';
import { createSchedule, retrieveSchedules, deleteSchedule, updateSchedule, startReadingSession, endReadingSession} from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const useSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    title: '',
    startDate: '',
    startTime: '',
    duration: 0,
    isRecurring: false,
    recurringDays: [],
  });
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Search, Filtering, and Batch Operations
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    startDate: '',
    endDate: '',
    isRecurring: null,
  });

  const daysOfWeek = [
    { id: 1, label: 'Monday' },
    { id: 2, label: 'Tuesday' },
    { id: 3, label: 'Wednesday' },
    { id: 4, label: 'Thursday' },
    { id: 5, label: 'Friday' },
    { id: 6, label: 'Saturday' },
    { id: 7, label: 'Sunday' },
  ];

  // Localization
  const [locale, setLocale] = useState('en-US');
  const [timeZone, setTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      try {
        const data = await retrieveSchedules();
        const formattedSchedules = data.data.map(schedule => ({
          ...schedule,
          startDate: schedule.startDate.split('T')[0],
          startTime: schedule.startTime.split('T')[1]?.split('.')[0],
        }));
        setSchedules(formattedSchedules);
      } catch (error) {
        toast.error('Error fetching schedules: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  // Filtered and searched schedules
  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = searchQuery
      ? schedule.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesStartDate = filterOptions.startDate
      ? new Date(schedule.startDate) >= new Date(filterOptions.startDate)
      : true;
    const matchesEndDate = filterOptions.endDate
      ? new Date(schedule.startDate) <= new Date(filterOptions.endDate)
      : true;
    const matchesRecurring =
      filterOptions.isRecurring !== null
        ? schedule.isRecurring === filterOptions.isRecurring
        : true;
    return matchesSearch && matchesStartDate && matchesEndDate && matchesRecurring;
  });

  // Utility functions for formatting
  const formatTitle = title => title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();

  const formatDate = dateStr => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    
    const localTime = date.toLocaleString('en-US', { timeZone: timeZone }); // Use user's time zone
    const localDate = new Date(localTime);
    
    const formattedHours = localDate.getHours();
    const formattedMinutes = localDate.getMinutes();
    const period = formattedHours >= 12 ? 'PM' : 'AM';
    const hour = formattedHours % 12 || 12;
  
    return `${hour}:${formattedMinutes.toString().padStart(2, '0')} ${period}`;
  };
  

  const formatTimeToHHMMSS = time => {
    if (!time) {
      return '00:00:00'; 
    }
    const parts = time.split(':');
    return parts.length === 2 ? `${time}:00` : time;
  };
  

  const handleRecurringDayChange = dayId => {
    setNewSchedule(prevSchedule => {
      const isSelected = prevSchedule.recurringDays.includes(dayId);
      return {
        ...prevSchedule,
        recurringDays: isSelected
          ? prevSchedule.recurringDays.filter(id => id !== dayId)
          : [...prevSchedule.recurringDays, dayId],
      };
    });
  };

  const handleRecurringDayChangeEdit = dayId => {
    setEditingSchedule(prevSchedule => {
      const isSelected = prevSchedule.recurringDays.includes(dayId);
      return {
        ...prevSchedule,
        recurringDays: isSelected
          ? prevSchedule.recurringDays.filter(id => id !== dayId)
          : [...prevSchedule.recurringDays, dayId],
      };
    });
  };

  // CRUD Operations
  const handleCreateSchedule = async () => {
    try {
      const scheduleData = {
        title: newSchedule.title,
        startDate: newSchedule.startDate,
        startTime: formatTimeToHHMMSS(newSchedule.startTime),
        duration: parseInt(newSchedule.duration, 10),
        isRecurring: newSchedule.isRecurring,
        recurringDays: newSchedule.isRecurring
          ? newSchedule.recurringDays.map(day => parseInt(day, 10))
          : [],
      };
      const response = await createSchedule(scheduleData);
      const createdSchedule = response.data;
      const formattedSchedule = {
        ...createdSchedule,
        startDate: createdSchedule.startDate.split('T')[0],
        startTime: createdSchedule.startTime.split('T')[1]?.split('.')[0],
      };
      setSchedules(prevSchedules => [...prevSchedules, formattedSchedule]);
      console.log('schedule created', createdSchedule)
      toast.success('Schedule created successfully!');
    } catch (error) {
      toast.error('Failed to create schedule: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleUpdateSchedule = async (id, payload) => {
    try {
      const response = await updateSchedule(id, payload);
      const updatedSchedule = await response.data.data;
      const formattedSchedule = {
        ...updatedSchedule,
        startDate: updatedSchedule.startDate.split('T')[0],
        startTime: updatedSchedule.startTime.split('T')[1]?.split('.')[0],
    };
    setSchedules(prevSchedules =>
        prevSchedules.map(schedule => (schedule._id === id ? formattedSchedule : schedule))
    );
      toast.success('Schedule updated successfully!');
    } catch (error) {
      console.log(error.message);
      toast.error('Failed to update schedule: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteSchedule = async id => {
    try {
      await deleteSchedule(id);
      setSchedules(prevSchedules => prevSchedules.filter(schedule => schedule._id !== id));
      toast.success('Schedule deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete schedule. ' + (error.response?.data?.message || error.message));
    }
  };

  const handleStartSession = async (scheduleId) => {
    try {
      const response = await startReadingSession(scheduleId);
      if (response.status === 200 || response.status === 201) {
        const sessionData = response.data?.data;
        console.log('start session', sessionData); // Make sure sessionData is correct
        
        if (sessionData) {
          navigate(`/study/${sessionData.scheduleId}`, { state: sessionData });
          console.log('start session', sessionData)
          toast.success('Session started successfully!');
        } else {
          console.log('start session', sessionData)
          toast.error('Session started, but no session data was returned.');
        }
      } else {
        
        toast.error(response.data?.message || 'Unexpected response from server.');
      }
    } catch (error) {
      
      console.error('Error starting session:', error);
      toast.error(error.response?.data?.message || 'Failed to start session.');
    }
  };
  
const handleEndSession = async scheduleId => {
  try {
    const response = await endReadingSession(scheduleId);
    if (response.status === 200) {
      toast.success('Session ended successfully!');
    } else {
      toast.error(response.data?.message || 'Unexpected response from server.');
    }
  } catch (error) {
    console.error('Error ending session:', error);
    toast.error(error.response?.data?.message || 'Failed to end session.');
  }
};

  

  return {
    schedules: filteredSchedules,
    newSchedule,
    editingSchedule,
    loading,
    daysOfWeek,
    formatTitle,
    formatDate,
    formatTime,
    locale,
    timeZone,
    searchQuery,
    filterOptions,
    setNewSchedule,
    setEditingSchedule,
    setLocale,
    setTimeZone,
    setSearchQuery,
    setFilterOptions,
    handleCreateSchedule,
    handleUpdateSchedule,
    handleDeleteSchedule,
    handleRecurringDayChange,
    handleRecurringDayChangeEdit,
    handleStartSession,
    handleEndSession,
  };
};

export default useSchedules;


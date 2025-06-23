import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [attendanceToday, setAttendanceToday] = useState(0);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const API = "http://localhost:5000/api";

  const fetchStudentCount = async () => {
    const res = await fetch(`${API}/students`);
    const data = await res.json();
    setStudentCount(data.length);
  };

  const fetchAttendance = async () => {
    const res = await fetch(`${API}/attendance/${date}`);
    const data = await res.json();
    if (data.records) {
      const present = data.records.filter((r: any) => r.status === 'present');
      setAttendanceToday(present.length);
    } else {
      setAttendanceToday(0);
    }
  };

  useEffect(() => {
    fetchStudentCount();
    fetchAttendance();
  }, []);

  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold mb-6'>📊 Dashboard</h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
        <div className='bg-blue-100 border-l-4 border-blue-600 p-4 rounded shadow'>
          <h2 className='text-xl font-semibold'>Total Students</h2>
          <p className='text-3xl mt-2'>{studentCount}</p>
        </div>

        <div className='bg-green-100 border-l-4 border-green-600 p-4 rounded shadow'>
          <h2 className='text-xl font-semibold'>Present Today</h2>
          <p className='text-3xl mt-2'>{attendanceToday}</p>
        </div>

        <div className='bg-purple-100 border-l-4 border-purple-600 p-4 rounded shadow'>
          <h2 className='text-xl font-semibold'>Date</h2>
          <p className='text-lg mt-2'>{date}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

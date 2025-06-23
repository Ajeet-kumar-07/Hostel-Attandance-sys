
import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import {toast} from 'react-toastify';

interface Student {
  _id: string;
  name: string;
  email: string;
  course: string;
}

interface AttendanceRecord {
  studentId: string;
  status: 'present' | 'absent';
}

const Attendance = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const API = "http://localhost:5000/api";

  const fetchStudents = async () => {
    const res = await fetch(`${API}/students`);
    const data = await res.json();
    setStudents(data);
  };

  const fetchAttendanceByDate = async () => {
    const res = await fetch(`${API}/attendance/${date}`);
    const data = await res.json();
    if (data?.records) {
      setAttendance(data.records.map((r: any) => ({
        studentId: r.studentId._id,
        status: r.status
      })));
    } else {
      setAttendance([]);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    fetchAttendanceByDate();
  }, [date]);

  const toggleStatus = (studentId: string) => {
    setAttendance((prev) => {
      const existing = prev.find((r) => r.studentId === studentId);
      if (existing) {
        return prev.map((r) =>
          r.studentId === studentId
            ? { ...r, status: r.status === 'present' ? 'absent' : 'present' }
            : r
        );
      } else {
        return [...prev, { studentId, status: 'present' }];
      }
    });
  };

  const getStatus = (studentId: string) => {
    const record = attendance.find((r) => r.studentId === studentId);
    return record?.status || 'absent';
  };

  const handleSubmit = async () => {
    await fetch(`${API}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, records: attendance })
    });
    toast.success('Attendance saved successfully');
  };

  const handleExport = () => {
    const csvContent =
      'Name,Email,Status\n' +
      students
        .map((s) => {
          const status = getStatus(s._id);
          return `${s.name},${s.email},${status}`;
        })
        .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `attendance_${date}.csv`);
    toast.info('CSV exported');
  };

  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold mb-4'>Attendance</h1>

      <div className='flex items-center gap-4 mb-4'>
        <label htmlFor='date'>Select Date:</label>
        <input type='date' value={date} onChange={(e) => setDate(e.target.value)} className='border px-3 py-2' />
        <button onClick={handleExport} className='bg-green-600 text-white px-4 py-2 rounded'>Export CSV</button>
      </div>

      <table className='min-w-full border'>
        <thead className='bg-gray-200'>
          <tr>
            <th className='p-2'>Name</th>
            <th className='p-2'>Email</th>
            <th className='p-2'>Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td className='border p-2'>{student.name}</td>
              <td className='border p-2'>{student.email}</td>
              <td className='border p-2'>
                <button
                  onClick={() => toggleStatus(student._id)}
                  className={`px-4 py-1 rounded text-white ${getStatus(student._id) === 'present' ? 'bg-blue-600' : 'bg-red-600'}`}
                >
                  {getStatus(student._id)}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleSubmit} className='mt-4 bg-blue-700 text-white px-4 py-2 rounded'>
        Save Attendance
      </button>
    </div>
  );
};

export default Attendance;

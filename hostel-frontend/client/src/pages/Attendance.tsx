import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';

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
    toast.success('✅ Attendance saved successfully');
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
    toast.info('📤 CSV exported');
  };

  return (
    <div className='p-6 max-w-5xl mx-auto'>
      <h1 className='text-4xl font-bold text-blue-800 mb-6'>📋 Attendance Management</h1>

      <div className='flex flex-col md:flex-row items-center gap-4 mb-6'>
        <label htmlFor='date' className='text-gray-700 font-medium'>Select Date:</label>
        <input
          type='date'
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className='border rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
        />
        <button
          onClick={handleExport}
          className='bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition duration-300 shadow-sm'
        >
          ⬇️ Export CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className='min-w-full text-sm text-left border-collapse'>
          <thead className='bg-blue-100 text-blue-800'>
            <tr>
              <th className='p-3 border-b'>Name</th>
              <th className='p-3 border-b'>Email</th>
              <th className='p-3 border-b'>Status</th>
            </tr>
          </thead>
          <tbody className='bg-white'>
            {students.map((student) => (
              <tr key={student._id} className='hover:bg-gray-50'>
                <td className='p-3 border-b'>{student.name}</td>
                <td className='p-3 border-b'>{student.email}</td>
                <td className='p-3 border-b'>
                  <button
                    onClick={() => toggleStatus(student._id)}
                    className={`px-4 py-1 rounded-full font-medium transition duration-300 shadow-sm ${
                      getStatus(student._id) === 'present'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    {getStatus(student._id)}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='mt-6 flex justify-end'>
        <button
          onClick={handleSubmit}
          className='bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold transition duration-300 shadow-md'
        >
          💾 Save Attendance
        </button>
      </div>
    </div>
  );
};

export default Attendance;

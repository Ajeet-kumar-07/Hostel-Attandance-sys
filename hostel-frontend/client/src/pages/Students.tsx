import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface Student {
  _id?: string;
  name: string;
  email: string;
  course: string;
}

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState<Student>({ name: '', email: '', course: '' });
  const [editId, setEditId] = useState<string | null>(null);

  const API = "https://hostel-backend-sbot.onrender.com";

  const fetchStudents = async () => {
    const res = await fetch(`${API}/students`);
    const data = await res.json();
    setStudents(data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await fetch(`${API}/students/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      toast.success('✅ Student updated');
    } else {
      await fetch(`${API}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      toast.success('✅ Student added');
    }

    setForm({ name: '', email: '', course: '' });
    setEditId(null);
    fetchStudents();
  };

  const handleDelete = async (id: string) => {
    await fetch(`${API}/students/${id}`, { method: 'DELETE' });
    toast.info('🗑️ Student deleted');
    fetchStudents();
  };

  const handleEdit = (student: Student) => {
    setForm({ name: student.name, email: student.email, course: student.course });
    setEditId(student._id || null);
  };

  return (
    <div className='p-6 max-w-5xl mx-auto'>
      <h1 className='text-4xl font-bold text-blue-800 mb-6'>🎓 Manage Students</h1>

      <form onSubmit={handleSubmit} className='bg-white rounded-lg shadow p-6 space-y-4 mb-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <input
            name='name'
            value={form.name}
            onChange={handleChange}
            placeholder='Full Name'
            className='border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm'
          />
          <input
            name='email'
            value={form.email}
            onChange={handleChange}
            placeholder='Email'
            className='border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm'
          />
          <input
            name='course'
            value={form.course}
            onChange={handleChange}
            placeholder='Course'
            className='border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm'
          />
        </div>
        <button
          type='submit'
          className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-300'
        >
          {editId ? '✏️ Update Student' : '➕ Add Student'}
        </button>
      </form>

      <div className='overflow-x-auto rounded-lg shadow'>
        <table className='min-w-full border text-sm'>
          <thead className='bg-blue-100 text-blue-800'>
            <tr>
              <th className='p-3 border-b'>Name</th>
              <th className='p-3 border-b'>Email</th>
              <th className='p-3 border-b'>Course</th>
              <th className='p-3 border-b'>Actions</th>
            </tr>
          </thead>
          <tbody className='bg-white'>
            {students.map((student) => (
              <tr key={student._id} className='hover:bg-gray-50'>
                <td className='p-3 border-b'>{student.name}</td>
                <td className='p-3 border-b'>{student.email}</td>
                <td className='p-3 border-b'>{student.course}</td>
                <td className='p-3 border-b space-x-2'>
                  <button
                    onClick={() => handleEdit(student)}
                    className='px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition duration-200'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student._id!)}
                    className='px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition duration-200'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;


import React, { useEffect, useState } from 'react';
import {toast} from 'react-toastify';

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

  const API = "http://localhost:5000/api";

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
        body: JSON.stringify(form)
      });
      toast.success('Student updated successfully');
    } else {
      await fetch(`${API}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      toast.success('Student added successfully');
    }
    setForm({ name: '', email: '', course: '' });
    setEditId(null);
    fetchStudents();
  };

  const handleDelete = async (id: string) => {
    await fetch(`${API}/students/${id}`, { method: 'DELETE' });
    toast.info('Student Deleted');
    fetchStudents();
  };

  const handleEdit = (student: Student) => {
    setForm({ name: student.name, email: student.email, course: student.course });
    setEditId(student._id || null);
  };

  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold mb-4'>Students</h1>

      <form onSubmit={handleSubmit} className='mb-6 space-y-3'>
        <input name='name' value={form.name} onChange={handleChange} placeholder='Name' className='border p-2 w-full' />
        <input name='email' value={form.email} onChange={handleChange} placeholder='Email' className='border p-2 w-full' />
        <input name='course' value={form.course} onChange={handleChange} placeholder='Course' className='border p-2 w-full' />
        <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded'>
          {editId ? 'Update Student' : 'Add Student'}
        </button>
      </form>

      <table className='min-w-full border'>
        <thead className='bg-gray-200'>
          <tr>
            <th className='p-2'>Name</th>
            <th className='p-2'>Email</th>
            <th className='p-2'>Course</th>
            <th className='p-2'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td className='border p-2'>{student.name}</td>
              <td className='border p-2'>{student.email}</td>
              <td className='border p-2'>{student.course}</td>
              <td className='border p-2'>
                <button onClick={() => handleEdit(student)} className='mr-2 text-blue-600'>Edit</button>
                <button onClick={() => handleDelete(student._id!)} className='text-red-600'>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Students;
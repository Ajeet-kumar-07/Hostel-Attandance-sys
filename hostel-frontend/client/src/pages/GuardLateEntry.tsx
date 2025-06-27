import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

type LateEntry = {
  _id?: string;
  studentName: string;
  time: string;
  reason: string;
  date: string;
  finePaid?: boolean;
};

const GuardLateEntry = () => {
  const [form, setForm] = useState<LateEntry>({
    studentName: '',
    time: '',
    reason: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [entries, setEntries] = useState<LateEntry[]>([]);

  const API = 'http://localhost:5000/api/late-entry';

  const fetchEntries = async () => {
    const res = await axios.get(API);
    setEntries(res.data);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { studentName, time, reason, date } = form;
    if (!studentName || !time || !reason || !date) {
      toast.error('Please fill all fields');
      return;
    }

    await axios.post(API, form);
    toast.success('Late entry added');
    setForm({ studentName: '', time: '', reason: '', date });
    fetchEntries();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🕒 Late Entry - Guard Portal</h1>

      <div className="space-y-4 mb-6">
        <input
          name="studentName"
          placeholder="Student Name"
          value={form.studentName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="time"
          type="time"
          value={form.time}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <textarea
          name="reason"
          placeholder="Reason"
          value={form.reason}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Submit Late Entry
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">📋 All Late Entries</h2>
      <ul className="divide-y border rounded">
        {entries.map((entry) => (
          <li key={entry._id} className="p-3">
            <p><strong>{entry.studentName}</strong> at <em>{entry.time}</em> on {entry.date}</p>
            <p>Reason: {entry.reason}</p>
            <p>Status: {entry.finePaid ? '✅ Fine Paid' : '❌ Pending Fine'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GuardLateEntry;

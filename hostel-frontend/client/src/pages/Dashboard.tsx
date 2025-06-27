import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';

const Dashboard = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [attendanceToday, setAttendanceToday] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [date] = useState<string>(new Date().toISOString().split('T')[0]);

  const API = "http://localhost:5000";
  const { width, height } = useWindowSize();

  const fetchStudentCount = async () => {
    const res = await fetch(`${API}/api/students`);
    const data = await res.json();
    setStudentCount(data.length);
  };

  const fetchAttendance = async () => {
    const res = await fetch(`${API}/api/attendance/${date}`);
    const data = await res.json();
    if (data.records) {
      const present = data.records.filter((r: any) => r.status === 'present');
      setAttendanceToday(present.length);
      if (present.length > 0 && present.length === studentCount) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }
    }
  };

  useEffect(() => {
    fetchStudentCount();
    fetchAttendance();
  }, []);

  const progress = studentCount ? (attendanceToday / studentCount) * 100 : 0;
  const absentCount = studentCount - attendanceToday;

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, type: 'spring' },
    }),
  };

  return (
    <div className="min-h-screen relative px-6 py-10 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 overflow-hidden">
      {showConfetti && <Confetti width={width} height={height} />}

      {/* Background animated blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute w-96 h-96 bg-blue-300 opacity-30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse top-[-100px] left-[-100px]" />
        <div className="absolute w-96 h-96 bg-pink-300 opacity-30 rounded-full mix-blend-multiply filter blur-3xl animate-ping top-20 right-[-120px]" />
        <div className="absolute w-96 h-96 bg-purple-300 opacity-30 rounded-full mix-blend-multiply filter blur-3xl animate-bounce bottom-[-150px] left-[30%]" />
      </div>

      <h1 className="text-4xl font-bold text-blue-700 mb-10 text-center">
        🏆 Hostel Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {[
          { title: 'Total Students', value: studentCount, icon: '🎓', color: 'blue' },
          { title: 'Present Today', value: attendanceToday, icon: '✅', color: 'green' },
          { title: 'Students Absent', value: absentCount, icon: '❌', color: 'red' },
          { title: "Today's Date", value: date, icon: '📅', color: 'purple' },
        ].map((card, i) => (
          <motion.div
            key={i}
            custom={i}
            initial="hidden"
            animate="visible"
            // variants={cardVariants}
            className={`bg-white/70 backdrop-blur-lg border-l-4 border-${card.color}-500 p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300`}
          >
            <div className="text-2xl">{card.icon}</div>
            <h2 className="text-lg font-semibold text-gray-700 mt-2">{card.title}</h2>
            <p className={`text-3xl font-bold text-${card.color}-600 mt-3`}>{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-12 max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
          📈 Attendance Progress
        </h3>
        <div className="w-full bg-gray-300 rounded-full h-5 overflow-hidden">
          <motion.div
            className="bg-green-600 h-5"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.2 }}
          />
        </div>
        <p className="text-sm mt-1 text-gray-600 text-center">
          {attendanceToday}/{studentCount} students present ({Math.round(progress)}%)
        </p>
      </div>

      {progress === 100 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          className="mt-10 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-md shadow-md text-yellow-800 text-center max-w-md mx-auto"
        >
          🎉 All students are present today! Amazing!
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;

import { useEffect, useState } from "react";
import { Dumbbell, Calendar, Target, Flame, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard({ userData }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (userData) {
      setUser(userData);
    } else {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    }
  }, [userData]);

  if (!user) {
    return <p className="text-white text-center mt-10">No user found. Please login.</p>;
  }

  // Split past vs upcoming
  const today = new Date().toISOString().split("T")[0];
  const pastActivities = user.activity?.filter(a => a.date < today) || [];
  const upcomingActivities = user.activity?.filter(a => a.date >= today) || [];

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 md:p-10 mt-8 space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold">
          Welcome back, <span className="text-orange-400">{user.name}</span> 👋
        </h1>
        <p className="text-gray-400">Here’s your fitness journey progress 🚀</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard icon={<Dumbbell />} label="Workouts" value={user.workouts || 0} color="from-pink-500 to-purple-600" />
        <StatCard icon={<Flame />} label="Calories" value={`${user.calories || 0} kcal`} color="from-orange-400 to-red-500" />
        <StatCard icon={<Clock />} label="Active Minutes" value={`${user.activeMinutes || 0} min`} color="from-green-400 to-emerald-600" />
        <StatCard icon={<Target />} label="Weight" value={`${user.weight || "—"} kg`} color="from-blue-400 to-indigo-600" />
      </div>

      {/* Goals + Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-neutral-900 p-6 rounded-2xl shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="text-yellow-400" /> Your Goals
          </h2>
          {user.goals?.length > 0 ? (
            <ul className="space-y-2 text-gray-300">
              {user.goals.map((goal, idx) => (
                <li
                  key={idx}
                  className="bg-neutral-800 px-4 py-2 rounded-lg hover:bg-neutral-700 transition"
                >
                  ✅ {goal}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No goals set yet</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-neutral-900 p-6 rounded-2xl shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="text-blue-400" /> Weekly Schedule
          </h2>
          {user.schedule?.length > 0 ? (
            <ul className="space-y-2 text-gray-300">
              {user.schedule.map((item, idx) => (
                <li
                  key={idx}
                  className="bg-neutral-800 px-4 py-2 rounded-lg hover:bg-neutral-700 transition flex justify-between"
                >
                  <span>
                    <span className="font-semibold">{item.day}:</span> {item.activity}
                  </span>
                  <span className="text-sm text-gray-400">{item.time}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No schedule added yet</p>
          )}
        </motion.div>
      </div>

      {/* Past Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-neutral-900 p-6 rounded-2xl shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ArrowLeft className="text-red-400" /> Past Activities
        </h2>
        {pastActivities.length > 0 ? (
          <ul className="space-y-2 text-gray-300">
            {pastActivities.map((act, idx) => (
              <li
                key={idx}
                className="bg-neutral-800 px-4 py-2 rounded-lg hover:bg-neutral-700 transition flex justify-between"
              >
                <span>{act.activity}</span>
                <span className="text-sm text-gray-400">{act.date}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No past activities</p>
        )}
      </motion.div>

      {/* Upcoming Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-neutral-900 p-6 rounded-2xl shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ArrowRight className="text-green-400" /> Upcoming Activities
        </h2>
        {upcomingActivities.length > 0 ? (
          <ul className="space-y-2 text-gray-300">
            {upcomingActivities.map((act, idx) => (
              <li
                key={idx}
                className="bg-neutral-800 px-4 py-2 rounded-lg hover:bg-neutral-700 transition flex justify-between"
              >
                <span>{act.activity}</span>
                <span className="text-sm text-gray-400">{act.date}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No upcoming activities</p>
        )}
      </motion.div>
    </div>
  );
}

/* Reusable Stat Card */
function StatCard({ icon, label, value, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`bg-gradient-to-r ${color} p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center`}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-sm font-semibold">{label}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </motion.div>
  );
}

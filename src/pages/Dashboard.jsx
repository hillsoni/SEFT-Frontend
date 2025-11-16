import { useEffect, useState } from "react";
import { 
  Dumbbell, Calendar, Target, Flame, Clock, Trophy, 
  TrendingUp, Heart, Brain, Apple, Activity, Award,
  ChevronRight, Plus, CheckCircle
} from "lucide-react";

// Mock auth context
const useAuth = () => ({
  user: {
    username: "John Doe",
    email: "john@example.com",
    weight: 75,
    calories: 2100,
    activeMinutes: 145,
    activity: [
      { date: "2025-01-15", activity: "Morning Run" },
      { date: "2025-01-14", activity: "Yoga Session" }
    ],
    goals: ["Lose 5kg by March", "Run 5km without stopping", "Build core strength"],
    completedYoga: ["Hatha Yoga", "Vinyasa Flow", "Yin Yoga"],
    completedMeditation: ["Mindfulness", "Guided Meditation"],
    schedule: [
      { day: "Monday", activity: "Cardio", time: "07:00 AM" },
      { day: "Wednesday", activity: "Strength", time: "07:00 AM" },
      { day: "Friday", activity: "Yoga", time: "06:00 PM" }
    ]
  },
  loading: false
});

export default function EnhancedDashboard() {
  const { user, loading } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    stats: {
      workouts: 0,
      calories: 0,
      activeMinutes: 0,
      weight: 0,
      completedChallenges: 0,
      activeChallenges: 0
    },
    latestDiet: null,
    activeChallenges: [],
    recentActivities: [],
    completedYoga: [],
    completedMeditation: [],
    goals: [],
    schedule: []
  });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoadingData(true);
      
      // Simulate API calls with mock data
      const latestDiet = {
        goal: "weight_loss",
        diet_type: "balanced",
        duration: "1_month",
        created_at: new Date().toISOString()
      };
      
      const activeChallenges = [
        {
          title: "30-Day Push-Up Challenge",
          progress: 65,
          duration: "30 Days",
          difficulty: "Intermediate"
        },
        {
          title: "7-Day Core Challenge",
          progress: 42,
          duration: "7 Days",
          difficulty: "Beginner"
        },
        {
          title: "HIIT Challenge",
          progress: 28,
          duration: "14 Days",
          difficulty: "Advanced"
        }
      ];
      
      const recentActivities = [
        {
          title: "30-Day Push-Up Challenge",
          daysCompleted: 20,
          totalDays: 30,
          progress: 65,
          date: "2025-01-15"
        },
        {
          title: "Morning Yoga Session",
          daysCompleted: 5,
          totalDays: 7,
          progress: 71,
          date: "2025-01-14"
        },
        {
          title: "HIIT Workout",
          daysCompleted: 4,
          totalDays: 14,
          progress: 28,
          date: "2025-01-13"
        }
      ];
      
      const completedYoga = user.completedYoga || [];
      const completedMeditation = user.completedMeditation || [];
      
      const stats = {
        workouts: (user.activity?.length || 0) + completedYoga.length + completedMeditation.length,
        calories: user.calories || 0,
        activeMinutes: user.activeMinutes || 0,
        weight: user.weight || 0,
        completedChallenges: 5,
        activeChallenges: activeChallenges.length
      };

      setDashboardData({
        stats,
        latestDiet,
        activeChallenges,
        recentActivities,
        completedYoga,
        completedMeditation,
        goals: user.goals || [],
        schedule: user.schedule || []
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || loadingData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="text-white text-xl flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          Loading your dashboard...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <p className="text-white text-center">Please login to view your dashboard</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Welcome back, <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">{user.username}</span> 👋
        </h1>
        <p className="text-gray-400">Here's your fitness journey at a glance 🚀</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard 
          icon={<Dumbbell className="w-6 h-6" />} 
          label="Workouts" 
          value={dashboardData.stats.workouts} 
          color="from-pink-500 to-purple-600" 
        />
        <StatCard 
          icon={<Flame className="w-6 h-6" />} 
          label="Calories" 
          value={`${dashboardData.stats.calories}`} 
          color="from-orange-400 to-red-500" 
        />
        <StatCard 
          icon={<Clock className="w-6 h-6" />} 
          label="Active Min" 
          value={`${dashboardData.stats.activeMinutes}`} 
          color="from-green-400 to-emerald-600" 
        />
        <StatCard 
          icon={<Target className="w-6 h-6" />} 
          label="Weight" 
          value={`${dashboardData.stats.weight || "—"} kg`} 
          color="from-blue-400 to-indigo-600" 
        />
        <StatCard 
          icon={<Trophy className="w-6 h-6" />} 
          label="Challenges" 
          value={`${dashboardData.stats.completedChallenges}/${dashboardData.stats.activeChallenges + dashboardData.stats.completedChallenges}`} 
          color="from-yellow-400 to-amber-500" 
        />
        <StatCard 
          icon={<Heart className="w-6 h-6" />} 
          label="Wellness" 
          value={dashboardData.completedYoga.length + dashboardData.completedMeditation.length} 
          color="from-purple-400 to-pink-500" 
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Latest Diet Plan */}
          {dashboardData.latestDiet && (
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 hover:border-orange-500/50 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <Apple className="w-6 h-6 text-green-400" />
                  <h2 className="text-xl font-semibold">Your Diet Plan</h2>
                </div>
                <button className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1 transition">
                  View Details <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Goal</p>
                    <p className="font-semibold text-green-400">
                      {dashboardData.latestDiet.goal?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Diet Type</p>
                    <p className="font-semibold text-blue-400 capitalize">
                      {dashboardData.latestDiet.diet_type || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Duration</p>
                    <p className="font-semibold text-purple-400">
                      {dashboardData.latestDiet.duration?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Created</p>
                    <p className="font-semibold text-orange-400">
                      {new Date(dashboardData.latestDiet.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Challenges */}
          {dashboardData.activeChallenges.length > 0 && (
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 hover:border-yellow-500/50 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-xl font-semibold">Active Challenges</h2>
                </div>
                <button className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1 transition">
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {dashboardData.activeChallenges.map((challenge, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-800/50 p-4 rounded-xl hover:bg-gray-700/50 transition cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{challenge.title}</h3>
                      <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                        {challenge.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                        style={{ width: `${challenge.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-400">
                      {challenge.duration} • {challenge.difficulty}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          {dashboardData.recentActivities.length > 0 && (
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 hover:border-green-500/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <h2 className="text-xl font-semibold">Recent Activity</h2>
              </div>
              <div className="space-y-2">
                {dashboardData.recentActivities.map((activity, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-800/50 px-4 py-3 rounded-lg hover:bg-gray-700/50 transition border-l-4 border-green-400"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-gray-400">
                          Day {activity.daysCompleted}/{activity.totalDays} • {activity.progress}%
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">{activity.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Wellness Activities */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 hover:border-purple-500/50 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-semibold">Wellness</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-800/50 p-4 rounded-xl hover:bg-gray-700/50 transition">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Yoga Sessions</span>
                  <span className="text-2xl font-bold text-purple-400">
                    {dashboardData.completedYoga.length}
                  </span>
                </div>
                <button className="w-full text-sm text-purple-400 hover:text-purple-300 flex items-center justify-center gap-1 mt-2 transition">
                  Start Yoga <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-xl hover:bg-gray-700/50 transition">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Meditation</span>
                  <span className="text-2xl font-bold text-blue-400">
                    {dashboardData.completedMeditation.length}
                  </span>
                </div>
                <button className="w-full text-sm text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1 mt-2 transition">
                  Start Meditation <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Goals */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 hover:border-orange-500/50 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-orange-400" />
              <h2 className="text-xl font-semibold">Your Goals</h2>
            </div>
            {dashboardData.goals.length > 0 ? (
              <ul className="space-y-2">
                {dashboardData.goals.map((goal, idx) => (
                  <li
                    key={idx}
                    className="bg-gray-800/50 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-700/50 transition"
                  >
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-sm">{goal}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No goals set yet</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-6 h-6 text-green-400" />
              <h2 className="text-xl font-semibold">Quick Actions</h2>
            </div>
            <div className="space-y-2">
              <button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Generate Diet Plan
              </button>
              <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2">
                <Trophy className="w-4 h-4" /> Join Challenge
              </button>
              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" /> Plan Workout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className={`bg-gradient-to-r ${color} p-4 rounded-xl shadow-lg flex flex-col items-center justify-center text-center hover:scale-105 transition-transform cursor-pointer`}>
      <div className="mb-2">{icon}</div>
      <p className="text-xs font-semibold mb-1">{label}</p>
      <h3 className="text-xl font-bold">{value}</h3>
    </div>
  );
}
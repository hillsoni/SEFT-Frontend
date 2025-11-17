import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Dumbbell, Calendar, Target, Flame, Clock, Trophy, 
  TrendingUp, Heart, Brain, Apple, Activity, Award,
  ChevronRight, Plus, CheckCircle, ArrowRight, Zap,
  User, Settings, LogOut
} from "lucide-react";

export default function EnhancedDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load user from localStorage
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      if (!storedUser) {
        navigate("/login");
        return;
      }
      setUser(storedUser);

      // Load challenges from localStorage
      const joinedChallenges = JSON.parse(localStorage.getItem("joinedChallenges") || "[]");
      const dailyTaps = JSON.parse(localStorage.getItem("dailyTaps") || "{}");
      
      // Calculate active challenges
      const activeChallenges = joinedChallenges
        .filter(c => !c.completed)
        .map(challenge => {
          const tapHistory = dailyTaps[challenge.id] || [];
          const durationDays = parseInt(challenge.duration.split(' ')[0]);
          const progress = Math.round((tapHistory.length / durationDays) * 100);
          return {
            ...challenge,
            progress,
            daysCompleted: tapHistory.length,
            totalDays: durationDays
          };
        })
        .slice(0, 3); // Show top 3

      // Load recent activities from localStorage
      const userActivity = JSON.parse(localStorage.getItem("userActivity") || "[]");
      const recentActivities = userActivity.slice(0, 5);

      // Load completed wellness activities
      const completedYoga = storedUser.completedYoga || [];
      const completedMeditation = storedUser.completedMeditation || [];

      // Calculate stats
      const completedChallengesCount = joinedChallenges.filter(c => c.completed).length;
      const stats = {
        workouts: userActivity.length,
        calories: storedUser.calories || 0,
        activeMinutes: storedUser.activeMinutes || 0,
        weight: storedUser.weight || 0,
        completedChallenges: completedChallengesCount,
        activeChallenges: activeChallenges.length
      };

      // Try to load latest diet from backend
      let latestDiet = null;
      try {
        const token = localStorage.getItem("access_token");
        if (token) {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/diet/latest`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            latestDiet = data.diet_plan;
          }
        }
      } catch (error) {
        console.log("Could not load diet plan:", error);
      }

      setDashboardData({
        stats,
        latestDiet,
        activeChallenges,
        recentActivities,
        completedYoga,
        completedMeditation,
        goals: storedUser.goals || [],
        schedule: storedUser.schedule || []
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
        <div className="text-white text-xl flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          Loading your dashboard...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
        <p className="text-white text-center mb-4">Please login to view your dashboard</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white p-4 md:p-8 pt-20">
      {/* Header with User Info */}
      <div className="mb-8 flex justify-between items-start animate-fade-in">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">{user.username || "User"}</span> 👋
          </h1>
          <p className="text-gray-400">Here's your fitness journey at a glance</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/about")}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-gray-800 rounded-lg transition text-red-400"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard 
          icon={<Dumbbell className="w-6 h-6" />} 
          label="Activities" 
          value={dashboardData.stats.workouts} 
          color="from-pink-500 to-purple-600" 
        />
        <StatCard 
          icon={<Flame className="w-6 h-6" />} 
          label="Calories" 
          value={dashboardData.stats.calories || "—"} 
          color="from-orange-400 to-red-500" 
        />
        <StatCard 
          icon={<Clock className="w-6 h-6" />} 
          label="Active Min" 
          value={dashboardData.stats.activeMinutes || "—"} 
          color="from-green-400 to-emerald-600" 
        />
        <StatCard 
          icon={<Target className="w-6 h-6" />} 
          label="Weight" 
          value={dashboardData.stats.weight ? `${dashboardData.stats.weight} kg` : "—"} 
          color="from-blue-400 to-indigo-600" 
        />
        <StatCard 
          icon={<Trophy className="w-6 h-6" />} 
          label="Challenges" 
          value={`${dashboardData.stats.completedChallenges}/${dashboardData.stats.completedChallenges + dashboardData.stats.activeChallenges}`} 
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
          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <QuickActionButton
                icon={<Apple className="w-5 h-5" />}
                label="Diet Plan"
                onClick={() => navigate("/diet")}
                gradient="from-green-500 to-emerald-600"
              />
              <QuickActionButton
                icon={<Trophy className="w-5 h-5" />}
                label="Challenges"
                onClick={() => navigate("/workout/challenges")}
                gradient="from-yellow-500 to-orange-500"
              />
              <QuickActionButton
                icon={<Dumbbell className="w-5 h-5" />}
                label="Workout"
                onClick={() => navigate("/routine")}
                gradient="from-blue-500 to-purple-500"
              />
            </div>
          </div>

          {/* Latest Diet Plan */}
          {dashboardData.latestDiet && (
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 hover:border-green-500/50 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <Apple className="w-6 h-6 text-green-400" />
                  <h2 className="text-xl font-semibold">Your Diet Plan</h2>
                </div>
                <button 
                  onClick={() => navigate("/diet")}
                  className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1 transition"
                >
                  View Details <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <InfoItem label="Goal" value={dashboardData.latestDiet.goal?.replace('_', ' ')} color="text-green-400" />
                  <InfoItem label="Diet Type" value={dashboardData.latestDiet.diet_type} color="text-blue-400" />
                  <InfoItem label="Duration" value={dashboardData.latestDiet.duration?.replace('_', ' ')} color="text-purple-400" />
                  <InfoItem label="Created" value={new Date(dashboardData.latestDiet.created_at).toLocaleDateString()} color="text-orange-400" />
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
                <button 
                  onClick={() => navigate("/workout/challenges")}
                  className="text-sm text-yellow-400 hover:text-yellow-300 flex items-center gap-1 transition"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {dashboardData.activeChallenges.map((challenge, idx) => (
                  <ChallengeCard key={idx} challenge={challenge} />
                ))}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          {dashboardData.recentActivities.length > 0 && (
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 hover:border-blue-500/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-semibold">Recent Activity</h2>
              </div>
              <div className="space-y-2">
                {dashboardData.recentActivities.map((activity, idx) => (
                  <ActivityItem key={idx} activity={activity} />
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
              <h2 className="text-xl font-semibold">Wellness Progress</h2>
            </div>
            <div className="space-y-3">
              <WellnessCard
                icon={<Activity className="w-5 h-5" />}
                label="Yoga Sessions"
                count={dashboardData.completedYoga.length}
                action={() => navigate("/workout/yoga")}
                color="text-purple-400"
                buttonText="Start Yoga"
                items={dashboardData.completedYoga}
              />
              <WellnessCard
                icon={<Brain className="w-5 h-5" />}
                label="Meditation"
                count={dashboardData.completedMeditation.length}
                action={() => navigate("/workout/meditation")}
                color="text-blue-400"
                buttonText="Start Meditation"
                items={dashboardData.completedMeditation}
              />
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
                {dashboardData.goals.slice(0, 5).map((goal, idx) => (
                  <li
                    key={idx}
                    className="bg-gray-800/50 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-700/50 transition text-sm"
                  >
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm mb-3">No goals set yet</p>
                <button
                  onClick={() => navigate("/routine")}
                  className="text-sm text-orange-400 hover:text-orange-300 flex items-center justify-center gap-1 mx-auto"
                >
                  Set Your Goals <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Motivational Card */}
          <div className="bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 p-6 rounded-2xl shadow-xl">
            <h3 className="text-xl font-bold mb-2">Keep Going! 💪</h3>
            <p className="text-white/90 text-sm mb-4">
              You're doing great! Every workout counts towards your goals.
            </p>
            <button
              onClick={() => navigate("/workout/challenges")}
              className="w-full bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Join a Challenge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component: Stat Card
function StatCard({ icon, label, value, color }) {
  return (
    <div className={`bg-gradient-to-r ${color} p-4 rounded-xl shadow-lg flex flex-col items-center justify-center text-center hover:scale-105 transition-transform cursor-pointer`}>
      <div className="mb-2">{icon}</div>
      <p className="text-xs font-semibold mb-1 opacity-90">{label}</p>
      <h3 className="text-xl font-bold">{value}</h3>
    </div>
  );
}

// Component: Quick Action Button
function QuickActionButton({ icon, label, onClick, gradient }) {
  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-r ${gradient} px-4 py-3 rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2`}
    >
      {icon} {label}
    </button>
  );
}

// Component: Info Item
function InfoItem({ label, value, color }) {
  return (
    <div>
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className={`font-semibold ${color} capitalize`}>
        {value || 'N/A'}
      </p>
    </div>
  );
}

// Component: Challenge Card
function ChallengeCard({ challenge }) {
  return (
    <div className="bg-gray-800/50 p-4 rounded-xl hover:bg-gray-700/50 transition cursor-pointer">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-sm">{challenge.title}</h3>
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
      <p className="text-xs text-gray-400">
        Day {challenge.daysCompleted}/{challenge.totalDays} • {challenge.difficulty}
      </p>
    </div>
  );
}

// Component: Activity Item
function ActivityItem({ activity }) {
  return (
    <div className="bg-gray-800/50 px-4 py-3 rounded-lg hover:bg-gray-700/50 transition border-l-4 border-blue-400">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium text-sm">{activity.title}</p>
          <p className="text-xs text-gray-400">
            {activity.type} • {activity.date}
          </p>
        </div>
        {activity.progress && (
          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
            {activity.progress}%
          </span>
        )}
      </div>
    </div>
  );
}

// Component: Wellness Card
function WellnessCard({ icon, label, count, action, color, buttonText, items = [] }) {
  const [showItems, setShowItems] = useState(false);
  
  return (
    <div className="bg-gray-800/50 p-4 rounded-xl hover:bg-gray-700/50 transition">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-gray-300 text-sm">{label}</span>
        </div>
        <span className={`text-2xl font-bold ${color}`}>{count}</span>
      </div>
      
      {/* Show completed items if any */}
      {count > 0 && (
        <div className="mb-3">
          <button
            onClick={() => setShowItems(!showItems)}
            className="text-xs text-gray-400 hover:text-gray-300 transition flex items-center gap-1"
          >
            {showItems ? '▼' : '▶'} View completed ({count})
          </button>
          
          {showItems && (
            <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
              {items.slice(0, 5).map((item, idx) => (
                <div key={idx} className="text-xs bg-gray-700/50 px-2 py-1 rounded flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span className="text-gray-300">{typeof item === 'string' ? item : item.title || 'Session'}</span>
                </div>
              ))}
              {items.length > 5 && (
                <p className="text-xs text-gray-500 px-2">+{items.length - 5} more</p>
              )}
            </div>
          )}
        </div>
      )}
      
      <button
        onClick={action}
        className={`w-full text-sm ${color} hover:opacity-80 flex items-center justify-center gap-1 transition`}
      >
        {buttonText} <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
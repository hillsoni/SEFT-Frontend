import React, { useEffect, useState } from "react";
import { FaFire, FaDumbbell, FaBolt, FaMedal, FaBook, FaCheckCircle, FaTrophy, FaLock } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const initialChallenges = [
  { 
    id: 1,
    title: "30-Day Push-Up Challenge", 
    type: "Strength", 
    duration: "30 Days", 
    difficulty: "Intermediate", 
    goal: "Strength",
    points: 300,
    tutorial: "Start with 10 push-ups daily. Gradually increase by 2 each week. Focus on form: hands shoulder-width apart, core engaged, straight line from head to heels. Rest 1-2 days per week. By day 30, aim for 30-50 push-ups in one set."
  },
  { 
    id: 2,
    title: "7-Day Core Challenge", 
    type: "Core", 
    duration: "7 Days", 
    difficulty: "Beginner", 
    goal: "Weight Loss",
    points: 100,
    tutorial: "Daily core routine: 20 crunches, 30-sec plank, 15 leg raises, 20 bicycle crunches. Rest on day 4. Focus on controlled movements and breathing. Engage your abs throughout each exercise. Perfect for beginners building core strength."
  },
  { 
    id: 3,
    title: "15-Day Squat Challenge", 
    type: "Legs", 
    duration: "15 Days", 
    difficulty: "Intermediate", 
    goal: "Weight Loss",
    points: 200,
    tutorial: "Begin with 20 bodyweight squats. Add 5 squats every 3 days. Keep feet shoulder-width apart, push hips back, keep chest up. Go as low as comfortable while maintaining form. Rest every 4th day to prevent overtraining."
  },
  { 
    id: 4,
    title: "Plank Challenge", 
    type: "Core", 
    duration: "10 Days", 
    difficulty: "Beginner", 
    goal: "Core Strength",
    points: 150,
    tutorial: "Start with 20-second planks. Increase by 5 seconds daily. Proper form: forearms on ground, elbows under shoulders, straight body line. Don't let hips sag. Breathe steadily. By day 10, hold for 60+ seconds."
  },
  { 
    id: 5,
    title: "HIIT Challenge", 
    type: "Cardio", 
    duration: "14 Days", 
    difficulty: "Advanced", 
    goal: "Weight Loss",
    points: 400,
    tutorial: "30-second high-intensity bursts followed by 30-second rest. Exercises: burpees, mountain climbers, jump squats, high knees. 4 rounds daily. Warm up 5 minutes before, cool down after. Push yourself during work intervals, recover fully during rest."
  },
  { 
    id: 6,
    title: "Yoga Flexibility Challenge", 
    type: "Flexibility", 
    duration: "12 Days", 
    difficulty: "Intermediate", 
    goal: "Trauma Recovery",
    points: 250,
    tutorial: "Daily 15-minute yoga flow. Focus on: forward folds, downward dog, child's pose, pigeon pose. Hold each pose 30 seconds. Breathe deeply. Don't force stretches. Flexibility improves gradually. Morning practice is ideal for loosening muscles."
  },
  { 
    id: 7,
    title: "Cardio Blast Challenge", 
    type: "Cardio", 
    duration: "7 Days", 
    difficulty: "Beginner", 
    goal: "Weight Loss",
    points: 100,
    tutorial: "Daily 20-minute cardio: brisk walking, jogging, or jumping jacks. Start at comfortable pace. Gradually increase intensity. Stay hydrated. Track heart rate if possible. Aim to break a sweat but still be able to talk. Perfect for beginners building stamina."
  },
  { 
    id: 8,
    title: "Full Body Strength Challenge", 
    type: "Strength", 
    duration: "21 Days", 
    difficulty: "Advanced", 
    goal: "Weight Gain",
    points: 500,
    tutorial: "3 days/week full-body workouts: squats, deadlifts, bench press, rows, overhead press. 3 sets of 8-12 reps. Rest days crucial for muscle growth. Increase weight when last set feels easy. Consume adequate protein (1g per lb bodyweight). Track progress weekly."
  },
  { 
    id: 9,
    title: "Meditation Challenge", 
    type: "Mindfulness", 
    duration: "7 Days", 
    difficulty: "Beginner", 
    goal: "Trauma Recovery",
    points: 100,
    tutorial: "Daily 10-minute guided meditation. Find quiet space. Sit comfortably, close eyes, focus on breath. When mind wanders, gently return to breath. Use apps like Headspace or Calm. Best done morning or before bed. Reduces stress and improves mental clarity."
  },
  { 
    id: 10,
    title: "Endurance Challenge", 
    type: "Stamina", 
    duration: "20 Days", 
    difficulty: "Advanced", 
    goal: "Maintain Fitness",
    points: 450,
    tutorial: "Progressive running program. Start: 15-min jog. Week 2: 20 minutes. Week 3: 25 minutes. Add 5 min weekly. Focus on steady pace over speed. Proper shoes essential. Run 4 days/week, rest 3. Cross-train with cycling or swimming on some rest days."
  },
];

const difficultyColors = {
  Beginner: "from-green-400 to-emerald-500",
  Intermediate: "from-yellow-400 to-orange-500",
  Advanced: "from-red-500 to-pink-600",
};

const difficultyBadgeColors = {
  Beginner: "bg-green-500/20 text-green-400 border-green-500/30",
  Intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Advanced: "bg-red-500/20 text-red-400 border-red-500/30",
};

const goals = ["All", "Weight Loss", "Weight Gain", "Maintain Fitness", "Trauma Recovery", "Strength", "Core Strength"];

const ChallengesPage = () => {
  const { user } = useAuth();
  const [challenges] = useState(initialChallenges);
  const [filter, setFilter] = useState("All");
  const [goalFilter, setGoalFilter] = useState("All");
  const [progress, setProgress] = useState({});
  const [joinedChallenges, setJoinedChallenges] = useState(() => {
    return JSON.parse(localStorage.getItem("joinedChallenges")) || [];
  });
  const [dailyTaps, setDailyTaps] = useState(() => {
    return JSON.parse(localStorage.getItem("dailyTaps")) || {};
  });
  const [expandedTutorial, setExpandedTutorial] = useState(null);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    localStorage.setItem("joinedChallenges", JSON.stringify(joinedChallenges));
  }, [joinedChallenges]);

  useEffect(() => {
    localStorage.setItem("dailyTaps", JSON.stringify(dailyTaps));
  }, [dailyTaps]);

  // Calculate total points from completed challenges
  useEffect(() => {
    const points = joinedChallenges
      .filter(c => c.completed)
      .reduce((sum, c) => sum + (c.points || 0), 0);
    setTotalPoints(points);
  }, [joinedChallenges]);

  const getTodayKey = () => {
    return new Date().toISOString().split('T')[0];
  };

  const canTapToday = (challengeId) => {
    const today = getTodayKey();
    const tapHistory = dailyTaps[challengeId] || [];
    return !tapHistory.includes(today);
  };

  const getDaysRemaining = (challenge) => {
    const durationDays = parseInt(challenge.duration.split(' ')[0]);
    const tapHistory = dailyTaps[challenge.id] || [];
    return durationDays - tapHistory.length;
  };

  const handleJoin = (challenge) => {
    if (!joinedChallenges.some((c) => c.id === challenge.id)) {
      setJoinedChallenges((prev) => [...prev, { ...challenge, progress: 0, startDate: new Date().toISOString() }]);
      setProgress((prev) => ({ ...prev, [challenge.id]: 0 }));
      setDailyTaps((prev) => ({ ...prev, [challenge.id]: [] }));
    }
  };

  const handleTapToday = (challenge) => {
    const today = getTodayKey();
    const challengeId = challenge.id;
    
    if (!canTapToday(challengeId)) {
      return;
    }

    const durationDays = parseInt(challenge.duration.split(' ')[0]);
    const currentTaps = (dailyTaps[challengeId] || []).length;
    const newTapCount = currentTaps + 1;
    const newProgress = Math.round((newTapCount / durationDays) * 100);

    setDailyTaps((prev) => ({
      ...prev,
      [challengeId]: [...(prev[challengeId] || []), today]
    }));

    setProgress((prev) => ({
      ...prev,
      [challengeId]: newProgress
    }));

    setJoinedChallenges((prev) =>
      prev.map((c) =>
        c.id === challengeId 
          ? { ...c, progress: newProgress, completed: newProgress >= 100 } 
          : c
      )
    );

    if (user) {
      const activityLog = {
        type: "Challenge Tap",
        title: challenge.title,
        date: today,
        progress: newProgress,
        daysCompleted: newTapCount,
        totalDays: durationDays
      };
      
      const existingActivity = JSON.parse(localStorage.getItem("userActivity")) || [];
      existingActivity.unshift(activityLog);
      localStorage.setItem("userActivity", JSON.stringify(existingActivity.slice(0, 50)));
    }
  };

  const filteredChallenges = challenges.filter((c) => {
    const difficultyMatch = filter === "All" || c.difficulty === filter;
    const goalMatch = goalFilter === "All" || c.goal === goalFilter;
    return difficultyMatch && goalMatch;
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 pt-24 pb-12">
      <div className="container mx-auto px-6 font-poppins text-gray-200">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 drop-shadow-lg">
            Fitness Challenges 🏆
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Push your limits, track your progress, and earn rewards. Complete challenges to unlock achievements!
          </p>
          
          {/* Stats Bar */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-lg px-6 py-3 rounded-xl border border-gray-700">
              <div className="text-2xl font-bold text-yellow-400">{joinedChallenges.length}</div>
              <div className="text-xs text-gray-400">Active</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-lg px-6 py-3 rounded-xl border border-gray-700">
              <div className="text-2xl font-bold text-green-400">
                {joinedChallenges.filter(c => c.completed).length}
              </div>
              <div className="text-xs text-gray-400">Completed</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-lg px-6 py-3 rounded-xl border border-gray-700">
              <div className="text-2xl font-bold text-purple-400">{totalPoints}</div>
              <div className="text-xs text-gray-400">Points</div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar filter={filter} setFilter={setFilter} goalFilter={goalFilter} setGoalFilter={setGoalFilter} />

        {/* Challenges Grid */}
        <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {filteredChallenges.length > 0 ? (
            filteredChallenges.map((challenge) => {
              const joinedChallenge = joinedChallenges.find(c => c.id === challenge.id);
              const isJoined = !!joinedChallenge;
              const currentProgress = progress[challenge.id] || 0;
              const daysRemaining = isJoined ? getDaysRemaining(challenge) : null;
              const canTap = isJoined && canTapToday(challenge.id);
              const isCompleted = currentProgress >= 100;

              return (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  isJoined={isJoined}
                  progress={currentProgress}
                  daysRemaining={daysRemaining}
                  canTap={canTap}
                  isCompleted={isCompleted}
                  onJoin={handleJoin}
                  onTap={handleTapToday}
                  expandedTutorial={expandedTutorial}
                  setExpandedTutorial={setExpandedTutorial}
                />
              );
            })
          ) : (
            <div className="col-span-full text-center py-20">
              <FaTrophy className="text-6xl text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-xl">
                No challenges match your filters
              </p>
            </div>
          )}
        </section>

        {/* Benefits Section */}
        <section className="text-center mt-20">
          <h2 className="text-4xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            Why Join Challenges?
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Benefit icon={<FaFire />} title="Burn Calories" text="Push your limits and burn energy." color="text-orange-500" />
            <Benefit icon={FaDumbbell} title="Build Strength" text="Target different muscle groups effectively." color="text-blue-500" />
            <Benefit icon={FaBolt} title="Increase Stamina" text="Challenge your endurance and resilience." color="text-yellow-500" />
            <Benefit icon={FaMedal} title="Earn Rewards" text="Complete challenges to unlock achievements." color="text-purple-500" />
          </div>
        </section>
      </div>
    </main>
  );
};

/* Challenge Card */
const ChallengeCard = ({ 
  challenge, 
  isJoined, 
  progress, 
  daysRemaining,
  canTap,
  isCompleted,
  onJoin, 
  onTap,
  expandedTutorial,
  setExpandedTutorial
}) => {
  const isTutorialExpanded = expandedTutorial === challenge.id;

  return (
    <div className="relative rounded-3xl p-6 shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 hover:scale-105 group">
      {/* Difficulty Badge */}
      <div className="absolute top-4 right-4 flex gap-2">
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${difficultyBadgeColors[challenge.difficulty]}`}>
          {challenge.difficulty}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
          {challenge.points} pts
        </span>
      </div>

      {/* Type Badge */}
      <div className="mb-4">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
          {challenge.type}
        </span>
      </div>

      {/* Content */}
      <h3 className="text-2xl font-bold mb-2 text-yellow-400 pr-24">{challenge.title}</h3>
      <p className="mb-2 text-gray-400 text-sm">{challenge.duration}</p>
      <p className="mb-4 text-pink-400 font-semibold flex items-center gap-2">
        <FaTrophy /> {challenge.goal}
      </p>

      {/* Tutorial Section */}
      <div className="mb-4">
        <button
          onClick={() => setExpandedTutorial(isTutorialExpanded ? null : challenge.id)}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition mb-2"
        >
          <FaBook className="text-lg" />
          <span className="font-semibold text-sm">{isTutorialExpanded ? 'Hide' : 'View'} Tutorial</span>
        </button>
        
        {isTutorialExpanded && (
          <div className="bg-gray-700/50 p-4 rounded-xl text-sm text-gray-300 leading-relaxed border border-blue-500/30 backdrop-blur-sm">
            {challenge.tutorial}
          </div>
        )}
      </div>

      {/* Progress & Days Remaining */}
      {isJoined && (
        <>
          <div className="w-full bg-gray-700/50 rounded-full h-3 mb-2 overflow-hidden">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-700 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-4 flex items-center justify-between">
            <span>
              {isCompleted 
                ? "✅ Challenge Completed!" 
                : `${daysRemaining} days remaining`}
            </span>
            <span className="font-bold text-green-400">{progress}%</span>
          </p>
        </>
      )}

      {/* Buttons */}
      {!isJoined ? (
        <button
          onClick={() => onJoin(challenge)}
          className="w-full px-4 py-3 rounded-xl font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-300 hover:to-orange-400 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <FaBolt /> Join Challenge
        </button>
      ) : isCompleted ? (
        <button className="w-full px-4 py-3 rounded-xl font-semibold bg-gray-700 text-gray-300 cursor-default flex items-center justify-center gap-2">
          <FaCheckCircle className="text-green-400" /> Completed 🎉
        </button>
      ) : (
        <button
          onClick={() => canTap && onTap(challenge)}
          disabled={!canTap}
          className={`w-full px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
            canTap
              ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-gray-900 hover:from-green-300 hover:to-emerald-400 shadow-lg hover:shadow-xl'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          {canTap ? (
            <>
              <FaCheckCircle /> Tap Today ({progress}%)
            </>
          ) : (
            <>
              <FaLock /> Already Tapped Today
            </>
          )}
        </button>
      )}
    </div>
  );
};

/* Filter Bar */
const FilterBar = ({ filter, setFilter, goalFilter, setGoalFilter }) => (
  <div className="sticky top-20 z-20 bg-gray-900/90 backdrop-blur-lg p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between gap-6 mb-10 border border-gray-700/50">
    {/* Difficulty Filter */}
    <div className="flex-1">
      <p className="text-sm text-gray-400 mb-3 font-semibold">Difficulty Level</p>
      <div className="flex gap-2 flex-wrap">
        {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
          <button
            key={level}
            className={`px-5 py-2 rounded-xl font-semibold transition-all ${
              filter === level
                ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 shadow-lg scale-105"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => setFilter(level)}
          >
            {level}
          </button>
        ))}
      </div>
    </div>

    {/* Goal Filter */}
    <div className="flex-1">
      <p className="text-sm text-gray-400 mb-3 font-semibold">Fitness Goal</p>
      <div className="flex gap-2 flex-wrap">
        {goals.slice(0, 4).map((goal) => (
          <button
            key={goal}
            className={`px-5 py-2 rounded-xl font-semibold transition-all ${
              goalFilter === goal
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-105"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => setGoalFilter(goal)}
          >
            {goal}
          </button>
        ))}
      </div>
    </div>
  </div>
);

const Benefit = ({ icon, title, text, color }) => (
  <div className="p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 text-center border border-gray-700/50 hover:border-gray-600/50 hover:scale-105 group">
    <div className={`text-5xl mb-4 ${color} group-hover:scale-110 transition-transform`}>{icon}</div>
    <h4 className="font-bold text-xl mb-2 text-white">{title}</h4>
    <p className="text-gray-400">{text}</p>
  </div>
);

export default ChallengesPage;
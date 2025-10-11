import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import { FaFire, FaDumbbell, FaBolt, FaMedal } from "react-icons/fa";

const initialChallenges = [
  { title: "30-Day Push-Up Challenge", type: "Strength", duration: "30 Days", difficulty: "Intermediate", goal: "Strength" },
  { title: "7-Day Core Challenge", type: "Core", duration: "7 Days", difficulty: "Beginner", goal: "Weight Loss" },
  { title: "15-Day Squat Challenge", type: "Legs", duration: "15 Days", difficulty: "Intermediate", goal: "Weight Loss" },
  { title: "Plank Challenge", type: "Core", duration: "10 Days", difficulty: "Beginner", goal: "Core Strength" },
  { title: "HIIT Challenge", type: "Cardio", duration: "14 Days", difficulty: "Advanced", goal: "Weight Loss" },
  { title: "Yoga Flexibility Challenge", type: "Flexibility", duration: "12 Days", difficulty: "Intermediate", goal: "Trauma Recovery" },
  { title: "Cardio Blast Challenge", type: "Cardio", duration: "7 Days", difficulty: "Beginner", goal: "Weight Loss" },
  { title: "Full Body Strength Challenge", type: "Strength", duration: "21 Days", difficulty: "Advanced", goal: "Weight Gain" },
  { title: "Meditation Challenge", type: "Mindfulness", duration: "7 Days", difficulty: "Beginner", goal: "Trauma Recovery" },
  { title: "Endurance Challenge", type: "Stamina", duration: "20 Days", difficulty: "Advanced", goal: "Maintain Fitness" },
];

const difficultyColors = {
  Beginner: "bg-gradient-to-r from-green-400 to-emerald-500",
  Intermediate: "bg-gradient-to-r from-yellow-400 to-orange-500",
  Advanced: "bg-gradient-to-r from-red-500 to-pink-600",
};

const goals = ["All", "Weight Loss", "Weight Gain", "Maintain Fitness", "Trauma Recovery", "Strength", "Core Strength"];

const ChallengesPage = () => {
  const [challenges] = useState(initialChallenges);
  const [filter, setFilter] = useState("All");
  const [goalFilter, setGoalFilter] = useState("All");
  const [progress, setProgress] = useState({});
  const [joinedChallenges, setJoinedChallenges] = useState(() => {
    return JSON.parse(localStorage.getItem("joinedChallenges")) || [];
  });

  useEffect(() => {
    localStorage.setItem("joinedChallenges", JSON.stringify(joinedChallenges));
  }, [joinedChallenges]);

  const handleJoin = (challenge) => {
    if (!joinedChallenges.some((c) => c.title === challenge.title)) {
      setJoinedChallenges((prev) => [...prev, { ...challenge, progress: 0 }]);
      setProgress((prev) => ({ ...prev, [challenge.title]: 0 }));
    }
  };

  const handleCompleteStep = (title) => {
    setProgress((prev) => {
      const newProgress = Math.min((prev[title] || 0) + 10, 100);
      return { ...prev, [title]: newProgress };
    });

    setJoinedChallenges((prev) =>
      prev.map((c) =>
        c.title === title ? { ...c, progress: Math.min((progress[title] || 0) + 10, 100) } : c
      )
    );
  };

  const filteredChallenges = challenges.filter((c) => {
    const difficultyMatch = filter === "All" || c.difficulty === filter;
    const goalMatch = goalFilter === "All" || c.goal === goalFilter;
    return difficultyMatch && goalMatch;
  });

  return (
    <>
      <main className="container mx-auto px-6 py-12 pt-20 font-poppins text-gray-200 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 min-h-screen">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 drop-shadow-lg">
          Fitness Challenges
        </h1>

        {/* Sticky Filter Bar */}
        <FilterBar filter={filter} setFilter={setFilter} goalFilter={goalFilter} setGoalFilter={setGoalFilter} />

        {/* Challenges Grid */}
        <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredChallenges.length > 0 ? (
            filteredChallenges.map((challenge, index) => (
              <ChallengeCard
                key={index}
                challenge={challenge}
                isJoined={joinedChallenges.some((c) => c.title === challenge.title)}
                progress={progress[challenge.title] || 0}
                onJoin={handleJoin}
                onCompleteStep={handleCompleteStep}
              />
            ))
          ) : (
            <p className="text-center text-gray-400 col-span-full">
              🚫 No challenges match your filters
            </p>
          )}
        </section>

        {/* Benefits Section */}
        <section className="mb-16 text-center mt-20">
          <h2 className="text-3xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            Why Join Challenges?
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Benefit icon={<FaFire />} title="Burn Calories" text="Push your limits and burn energy." />
            <Benefit icon={<FaDumbbell />} title="Build Strength" text="Target different muscle groups effectively." />
            <Benefit icon={<FaBolt />} title="Increase Stamina" text="Challenge your endurance and resilience." />
            <Benefit icon={<FaMedal />} title="Stay Motivated" text="Feel accomplished as you complete goals." />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

/* --- Challenge Card --- */
const ChallengeCard = ({ challenge, isJoined, progress, onJoin, onCompleteStep }) => {
  return (
    <div className="relative rounded-2xl p-6 shadow-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 hover:scale-105 transition">
      {/* Difficulty Badge */}
      <span
        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-white text-sm font-bold ${difficultyColors[challenge.difficulty]}`}
      >
        {challenge.difficulty}
      </span>

      {/* Content */}
      <h3 className="text-xl font-bold mb-2 text-yellow-400">{challenge.title}</h3>
      <p className="mb-1 text-gray-300">{challenge.type} Challenge</p>
      <p className="mb-1 text-gray-400">{challenge.duration}</p>
      <p className="mb-4 text-pink-400 font-semibold">🎯 Goal: {challenge.goal}</p>

      {/* Progress */}
      {isJoined && (
        <div className="w-full bg-gray-700/50 rounded-full h-3 mb-4 overflow-hidden">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {/* Buttons */}
      {!isJoined ? (
        <button
          onClick={() => onJoin(challenge)}
          className="w-full px-4 py-2 rounded-full font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-300 hover:to-orange-400 transition"
        >
          Join Challenge 🚀
        </button>
      ) : progress < 100 ? (
        <button
          onClick={() => onCompleteStep(challenge.title)}
          className="w-full px-4 py-2 rounded-full font-semibold bg-gradient-to-r from-green-400 to-emerald-500 text-gray-900 hover:from-green-300 hover:to-emerald-400 transition"
        >
          Mark Step Complete ✅ ({progress}%)
        </button>
      ) : (
        <button className="w-full px-4 py-2 rounded-full font-semibold bg-gray-600 text-gray-300 cursor-default">
          Completed 🎉
        </button>
      )}
    </div>
  );
};

/* --- Reusable FilterBar --- */
const FilterBar = ({ filter, setFilter, goalFilter, setGoalFilter }) => (
  <div className="sticky top-20 z-20 bg-gray-900/90 backdrop-blur-md p-4 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between gap-6 mb-10 border border-gray-700/50">
    {/* Difficulty Filter */}
    <div className="flex gap-2 flex-wrap justify-center">
      {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
        <button
          key={level}
          className={`px-5 py-2 rounded-full font-semibold transition ${
            filter === level
              ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 shadow-lg"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
          onClick={() => setFilter(level)}
        >
          {level}
        </button>
      ))}
    </div>

    {/* Goal Filter */}
    <div className="flex gap-2 flex-wrap justify-center">
      {goals.map((goal) => (
        <button
          key={goal}
          className={`px-5 py-2 rounded-full font-semibold transition ${
            goalFilter === goal
              ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
          onClick={() => setGoalFilter(goal)}
        >
          {goal}
        </button>
      ))}
    </div>
  </div>
);

const Benefit = ({ icon, title, text }) => (
  <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-md hover:shadow-lg transition text-center text-gray-200 border border-gray-700/50">
    <div className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-4">{icon}</div>
    <h4 className="font-bold text-lg mb-2">{title}</h4>
    <p className="text-gray-400">{text}</p>
  </div>
);

export default ChallengesPage;

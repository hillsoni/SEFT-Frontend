import React, { useState } from "react";
import "./YogaMeditation.css";
import { FaHeart, FaBrain, FaSpa, FaMoon } from "react-icons/fa";
import Footer from "./Footer";
import { useAuth } from "../context/AuthContext";

const Meditation = ({ userProfile, setUserProfile }) => {
  const { user, updateUser } = useAuth();

  const [completedMeditation, setCompletedMeditation] = useState(
    user?.completedMeditation || []
  );

  const meditationTypes = [
    {
      title: "Mindfulness Meditation",
      description: "Focus on the present moment and develop awareness of your thoughts.",
      img:"https://d18zdz9g6n5za7.cloudfront.net/wellness-videos/1020/1020-63-mindfulness-meditation-to-enhance-motivation-a0fe.jpg",
      link: "https://youtu.be/6p_yaNFSYao?si=E6okVI2UU87DB3DJ",
      benefit: "Enhances self-awareness 🧠"
    },
    {
      title: "Guided Meditation",
      description: "Follow a guided visualization to relax and reduce stress.",
      img:"https://www.connectedkarma.org/cdn/shop/files/Meditation_1.jpg?v=1708133334",
      link: "https://www.youtube.com/watch?v=uTN29kj7e-w",
      benefit: "Reduces anxiety 🌿"
    },
    {
      title: "Transcendental Meditation",
      description: "Use a mantra to reach a deep state of relaxation and awareness.",
      img:"https://i0.wp.com/www.positivitysparkles.com/wp-content/uploads/2024/08/Transcendental-Meditation.zip-Transcendental-Meditation-3.png?ssl=1",
      link: "https://www.youtube.com/shorts/nF4HPegyGgU",
      benefit: "Deep relaxation ✨"
    },
    {
      title: "Body Scan Meditation",
      description: "Focus attention on different parts of the body to release tension.",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfPRWu7JacuPhgZuSkkDY63HG41MVPtz37NA_56MGem3JBmvHBLXevKDKkBG-qqD86wCA&usqp=CAU",
      link: "https://www.youtube.com/watch?v=aH72AScs0qk",
      benefit: "Releases body tension 💆"
    },
    {
      title: "Loving-Kindness Meditation",
      description: "Cultivate compassion and love for yourself and others.",
      img:"https://ggia2.s3.us-west-2.amazonaws.com/assets/image/love_cropped_-_abcdef_-_6b5ea6a3db2fa9cc8a69f2144a14c62ee6a10606.jpg",
      link: "https://youtu.be/sDi40FQcaIU?si=947mirOMhYpikhC5",
      benefit: "Boosts compassion ❤️"
    },
    {
      title: "Zen Meditation",
      description: "Practice seated meditation to calm the mind and increase focus.",
      img:"https://img.freepik.com/premium-photo/monk-zen-meditation-forest-with-waterfalls_434911-614.jpg",
      link: "https://youtu.be/aTIV9djESbY?si=LhRDKwnJwYIiEY7X",
      benefit: "Sharpens focus 🪷"
    },
    {
      title: "Breath Awareness Meditation",
      description: "Focus on the breath to cultivate calmness and mindfulness.",
      img:"https://healthwire.pk/wp-content/uploads/2022/04/breathing-exercises.jpg",
      link: "https://youtu.be/YFSc7Ck0Ao0?si=p1aZ-imF7UcQFaQ4",
      benefit: "Calms the mind 🌬️"
    },
    {
      title: "Chakra Meditation",
      description: "Balance your energy centers for mental and emotional well-being.",
      img: "https://www.hindustantimes.com/ht-img/img/2024/04/11/550x309/gc308d801ffb4b08e939_1712857798644_1712857798930.jpg",
      link: "https://www.youtube.com/shorts/fFoknQ1ZEw4",
      benefit: "Balances energy centers 🔮"
    },
    {
      title: "Sound Meditation",
      description: "Use sound vibrations to relax the mind and deepen meditation.",
      img: "https://img-c.udemycdn.com/course/750x422/5881172_f93a_3.jpg",
      link: "https://youtu.be/unCya_-8ECs?si=Qhdx4UFeSBFBCrN4M",
      benefit: "Relieves stress with sound 🎶"
    },
    {
      title: "Yoga Nidra",
      description: "Guided sleep meditation to completely relax the body and mind.",
      img:"https://www.awaremind.org/blog/wp-content/uploads/2018/05/yognidra.jpg",
      link: "https://youtu.be/uPSml_JQGVY?si=-iuqJgE-8sGodT18",
      benefit: "Improves sleep quality 😴"
    },
    {
      title: "Mantra Meditation",
      description: "Repeat a sound or phrase to focus the mind and enhance concentration.",
      img:"https://asmy.org.au/app/uploads/2017/08/mantra-meditation-self-realization-848.jpg",
      link:"https://youtu.be/vH11undyI2o?si=HKUb0IFHfaK3orSU",
      benefit: "Increases concentration 🔔"
    },
    {
      title: "Walking Meditation",
      description: "Mindful walking to connect movement with awareness and calm the mind.",
      img:"https://d1migpe0gurg12.cloudfront.net/Blogs/listingImage/walking%20meditation.webp",
      link:"https://youtu.be/uzOh2ZZp3dg?si=shvDqkWNAUzR3Em2",
      benefit: "Connects body & mind 🚶"
    }
  ];

  // Handle completion
  const handleComplete = (med) => {
    if (!completedMeditation.includes(med.title)) {
      const updatedCompleted = [...completedMeditation, med.title];
      setCompletedMeditation(updatedCompleted);

      const newActivity = {
        type: "Meditation",
        title: med.title,
        date: new Date().toISOString().split("T")[0],
        completed: true,
      };

      updateUser({
        completedMeditation: updatedCompleted,
        activity: [...(user.activity || []), newActivity],
      });
    }
  };

  // Handle start session
  const startSession = (med) => {
    window.open(med.link, "_blank");

    if (userProfile && setUserProfile) {
      const updatedProfile = { ...userProfile };
      if (!updatedProfile.completedMeditation) updatedProfile.completedMeditation = [];
      if (!updatedProfile.completedMeditation.find((m) => m.title === med.title)) {
        updatedProfile.completedMeditation.push({
          title: med.title,
          link: med.link,
          img: med.img,
        });
      }
      setUserProfile(updatedProfile);
    }
  };

  return (
    <>
      <main className="container mx-auto pt-20 px-6 py-12 font-poppins text-gray-100 bg-gray-900">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-yellow-400">
          Meditation
        </h1>

        <section className="text-center mb-12 text-lg md:text-xl leading-relaxed text-gray-300">
          <p>
            Explore different meditation techniques to reduce stress, increase focus, 
            and promote inner peace.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-yellow-400 drop-shadow-lg text-center">
            Meditation Techniques
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {meditationTypes.map((med, index) => (
              <MeditationCard
                key={index}
                meditation={med}
                completed={completedMeditation.includes(med.title)}
                onComplete={() => handleComplete(med)}
                onStart={() => startSession(med)}
              />
            ))}
          </div>
        </section>
      </main>

    </>
  );
};

// ✅ MeditationCard component (similar to YogaCard)
const MeditationCard = ({ meditation, completed, onComplete, onStart }) => (
  <div className="yoga-card rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition transform cursor-pointer bg-white">
    <img src={meditation.img} alt={meditation.title} className="w-full h-48 object-cover" />
    <div className="p-6">
      <h3 className="text-xl font-bold mb-2 text-gray-900">{meditation.title}</h3>
      <p className="text-gray-700 mb-3">{meditation.description}</p>
      {meditation.benefit && (
        <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
          {meditation.benefit}
        </span>
      )}
      <div className="flex flex-col gap-2">
        <button
          onClick={onStart}
          className="btn bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded-full transition"
        >
          Start Session →
        </button>
        {!completed && (
          <button
            onClick={onComplete}
            className="btn bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-full transition"
          >
            Mark as Completed
          </button>
        )}
        {completed && <span className="text-green-700 font-bold">✅ Completed</span>}
      </div>
    </div>
  </div>
);

export default Meditation;

import React, { useState } from "react";   // ✅ FIXED: added useState
import "./YogaMeditation.css";
import { FaHeart, FaBrain, FaSpa, FaMoon } from "react-icons/fa";
import Footer from "./Footer";
import { useAuth } from "../context/AuthContext";

const YogaMeditation = ({ userProfile, setUserProfile }) => {
  const { user, updateUser } = useAuth(); // Using context for user & update

  const [completedYoga, setCompletedYoga] = useState(user?.completedYoga || []);

  const yogaTypes = [
    {
      title: "Hatha Yoga",
      description: "Gentle introduction to basic yoga postures for beginners.",
      mental: "Helps calm the mind, reduce anxiety, and improve focus.",
      img: "https://cdn.bodynova.de/out/pictures/ddmedia/Maren_Beitragsbild.jpg",
      youtube: "https://youtu.be/uiXAIgurwJU?si=ULL4fZ4bNdOXHSSb",
    },
    {
      title: "Vinyasa Flow",
      description: "Dynamic practice linking breath with movement.",
      mental: "Encourages mindfulness and reduces stress by synchronizing breath and body.",
      img: "https://www.doyou.com/wp-content/uploads/2021/01/7-reasons-to-practice-vinyasa-yoga-1-768x576.jpg",
      youtube: "https://youtu.be/SZU7Sbgu57o?si=AzgkMpuc-GU9e8Qp",
    },
    {
      title: "Yin Yoga",
      description: "Slow-paced poses held longer to target deep tissues.",
      mental: "Promotes deep relaxation and emotional balance.",
      img: "https://cdn-aolkg.nitrocdn.com/JEsNUzsMoDdLqhSXkopLhNFWnBniacqf/assets/images/optimized/rev-5c77932/www.yoganatomy.com/wp-content/uploads/2021/09/ying-yoga-ashtanga-myth-h.jpg",
      youtube: "https://youtu.be/nwBcidD3xvY?si=esH0oESKE9_RAfxy",
    },
    {
      title: "Ashtanga Yoga",
      description: "Rigorous style following a specific sequence for strength and stamina.",
      mental: "Builds discipline, focus, and mental resilience.",
      img: "https://www.yogabasics.com/yogabasics2025/wp-content/uploads/2021/03/Ashtanga-Yoga.jpeg",
      youtube: "https://youtu.be/LD-g8oytVUQ?si=eIQ4pTk5YQA90-UF",
    },
    {
      title: "Kundalini Yoga",
      description: "Focus on breath, meditation, and energy awakening.",
      mental: "Awakens inner awareness and promotes spiritual growth.",
      img: "https://www.greenyogashop.com/cdn/shop/articles/Yogastile-Kundalini-yoga.jpg?v=1710858370",
      youtube: "https://youtu.be/RGRpH_KlVMM?si=VClUjYoHk7uZoORz",
    },
    {
      title: "Restorative Yoga",
      description: "Gentle poses with props for relaxation and stress relief.",
      mental: "Soothes the nervous system and reduces mental fatigue.",
      img: "https://www.verywellfit.com/thmb/KLS5_BnaW0yG0uOoQEsdcyDxiNw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/beautiful-young-yoga-girl-lying-in-asana-shavasana-653952114-74c56c2a731b439b8e9f7d0dc0b9dbd2.jpg",
      youtube: "https://youtu.be/SGZdaH_fVNE?si=qz6oqiazl01NBocP",
    },
    {
      title: "Power Yoga",
      description: "Fitness-based yoga to build strength and endurance.",
      mental: "Boosts confidence and helps release mental tension.",
      img: "https://kavaalya.com/wp-content/uploads/2020/10/postura-power-yoga.jpg",
      youtube: "https://youtu.be/rOAdwyKyD2w?si=iIM396Jej7WEYKu5",
    },
    {
      title: "Iyengar Yoga",
      description: "Focus on alignment using props to improve posture.",
      mental: "Improves concentration and mental clarity through precision.",
      img: "https://www.yogisima.com/app/uploads/2019/05/yoga_iyengar-826x550.jpg",
      youtube: "https://youtu.be/5vet5NCY2c0?si=2U1sqK0O0IVRzThU",
    },
    {
      title: "Prenatal Yoga",
      description: "Yoga practice tailored for expectant mothers.",
      mental: "Promotes emotional stability and reduces stress during pregnancy.",
      img: "https://images.squarespace-cdn.com/content/v1/5abdee1596d455819877579b/1648274019067-I2YJFHCOB685D1D9ZXL2/1.jpg",
      youtube: "https://youtu.be/B87FpWtkIKA?si=D5Vtep7ltrfzO5r8",
    },
    {
      title: "Bikram Yoga",
      description: "Hot yoga sequence practiced in a heated room.",
      mental: "Enhances willpower, determination, and mental endurance.",
      img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      youtube: "https://youtu.be/Ocg3InAEZMU?si=V4IXOM6m85yIoNkC",
    },
    {
      title: "Acro Yoga",
      description: "Combination of yoga and acrobatics for balance and trust.",
      mental: "Builds trust, connection, and joy with others.",
      img: "https://media.istockphoto.com/id/621590550/photo/strong-young-couple-doing-acroyoga-workout.jpg?s=612x612&w=0&k=20&c=XiGuDa15IQFtWyiwC9JcvT_1JPoU05ft8yefBoUi6Hc=",
      youtube: "https://youtu.be/xECiTdgy9nE?si=OJR3VjPxhPdKK45m",
    },
    {
      title: "Sivananda Yoga",
      description: "Classical yoga focusing on basic postures, breathing, and relaxation.",
      mental: "Encourages peace of mind and balanced emotions.",
      img: "https://www.forceful-tranquility.com/wp-content/uploads/2021/10/Jun-bow-pose-1536x896.jpg",
      youtube: "https://www.youtube.com/live/k7aIDUgxwz8?si=9dlqWH_0SdNK-S44",
    },
  ];

 const handleComplete = (yoga) => {
  if (!completedYoga.includes(yoga.title)) {
    const updatedCompleted = [...completedYoga, yoga.title];
    setCompletedYoga(updatedCompleted);

    const newActivity = {
      type: "Yoga",
      title: yoga.title,
      date: new Date().toISOString().split("T")[0],
      completed: true,
    };

    // ✅ Persist via context
    updateUser({
      completedYoga: updatedCompleted,
      activity: [...(user.activity || []), newActivity],
    });
  }
};

  const startSession = (yoga) => {
    window.open(yoga.youtube, "_blank");

    if (userProfile && setUserProfile) {
      const updatedProfile = { ...userProfile };
      if (!updatedProfile.completedYoga) updatedProfile.completedYoga = [];
      if (
        !updatedProfile.completedYoga.find((y) => y.title === yoga.title)
      ) {
        updatedProfile.completedYoga.push({
          title: yoga.title,
          youtube: yoga.youtube,
          img: yoga.img,
        });
      }
      setUserProfile(updatedProfile);
    }
  };

  return (
    <>
      <main className="container mx-auto pt-20 px-6 py-12 font-poppins text-gray-100 bg-gray-900">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-yellow-400">
          Yoga
        </h1>

        <section className="yoga-intro text-center mb-12 text-lg md:text-xl leading-relaxed text-gray-300">
          <p>
            Discover the transformative power of yoga. Whether you're looking to
            improve flexibility, reduce stress, or find inner peace, our guided
            sessions will help you achieve balance in both body and mind.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-yellow-400 drop-shadow-lg text-center">
            Yoga Categories
          </h2>
          <div className="yoga-categories grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {yogaTypes.map((yoga, index) => (
              <YogaCard
                key={index}
                yoga={yoga}
                completed={completedYoga.includes(yoga.title)}
                onComplete={() => handleComplete(yoga)}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

const YogaCard = ({ yoga, completed, onComplete }) => (
  <div className="yoga-card rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition transform cursor-pointer bg-white">
    <img
      src={yoga.img}
      alt={yoga.title}
      className="w-full h-48 object-cover"
    />
    <div className="p-6">
      <h3 className="text-xl font-bold mb-2 text-gray-900">{yoga.title}</h3>
      <p className="text-gray-700 mb-3">{yoga.description}</p>
      {yoga.mental && (
        <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
          {yoga.mental}
        </span>
      )}
      <div className="flex flex-col gap-2">
        <a
          href={yoga.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="btn bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded-full transition"
        >
          Start Session →
        </a>
        {!completed && (
          <button
            onClick={onComplete}
            className="btn bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-full transition"
          >
            Mark as Completed
          </button>
        )}
        {completed && (
          <span className="text-green-700 font-bold">✅ Completed</span>
        )}
      </div>
    </div>
  </div>
);

export default YogaMeditation;

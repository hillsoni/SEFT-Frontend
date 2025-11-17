import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import yogaLady from "../assets/yoga-lady.png";
import Contact from "./About";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDumbbell,
  faRobot,
  faUtensils,
  faAppleAlt,
  faTrophy,
  faHeart,
  faBrain,
  faFire,
  faStar,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [stats, setStats] = useState({
    users: 0,
    workouts: 0,
    dietPlans: 0,
    challenges: 0,
  });

  // Animated counter effect
  useEffect(() => {
    const animateValue = (key, start, end, duration) => {
      const range = end - start;
      const increment = end > start ? 1 : -1;
      const stepTime = Math.abs(Math.floor(duration / range));
      let current = start;

      const timer = setInterval(() => {
        current += increment;
        setStats((prev) => ({ ...prev, [key]: current }));
        if (current === end) {
          clearInterval(timer);
        }
      }, stepTime);
    };

    animateValue("users", 0, 10000, 2000);
    animateValue("workouts", 0, 50000, 2000);
    animateValue("dietPlans", 0, 5000, 2000);
    animateValue("challenges", 0, 1000, 2000);
  }, []);

  return (
    <main className="bg-gradient-to-br from-black via-gray-900 to-black text-white font-poppins">
      {/* Hero Section - Enhanced */}
      <section className="relative px-6 py-32 max-w-7xl mx-auto overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left Side - Enhanced Text */}
          <div className="text-left space-y-6 animate-fade-in">
            <div className="inline-block">
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 rounded-full text-sm font-semibold animate-bounce">
                🚀 #1 AI Fitness Platform
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
              Transform Your Body With{" "}
              <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
                AI-Powered Fitness
              </span>
            </h1>
            
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl">
              Get personalized workouts, AI nutrition coaching, and real-time guidance tailored to your goals. 
              Join thousands transforming their lives today.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-pink-500/50 hover:scale-105 transition-all duration-300"
              >
                Start Free Trial
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-lg border-2 border-white/10 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faHeart} className="text-pink-500" />
                <span>10K+ Happy Users</span>
              </div>
            </div>
          </div>

          {/* Right Side - Enhanced Image */}
          <div className="relative animate-float">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
            <img
              src={yogaLady}
              alt="Fitness Transformation"
              className="relative w-full max-w-md mx-auto rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500"
            />
            
            {/* Floating Stats Cards */}
            <div className="absolute top-10 -left-10 bg-black/80 backdrop-blur-lg p-4 rounded-2xl shadow-xl border border-white/10 animate-slide-in-left">
              <div className="text-3xl font-bold text-green-400">150+</div>
              <div className="text-xs text-gray-400">Workouts</div>
            </div>
            
            <div className="absolute bottom-10 -right-10 bg-black/80 backdrop-blur-lg p-4 rounded-2xl shadow-xl border border-white/10 animate-slide-in-right">
              <div className="text-3xl font-bold text-orange-400">24/7</div>
              <div className="text-xs text-gray-400">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - New */}
      <section className="px-6 py-16 bg-gradient-to-r from-gray-900 via-purple-900/20 to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard icon={faHeart} value={`${stats.users.toLocaleString()}+`} label="Active Users" />
            <StatCard icon={faDumbbell} value={`${stats.workouts.toLocaleString()}+`} label="Workouts Completed" />
            <StatCard icon={faAppleAlt} value={`${stats.dietPlans.toLocaleString()}+`} label="Diet Plans" />
            <StatCard icon={faTrophy} value={`${stats.challenges.toLocaleString()}+`} label="Challenges Won" />
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section className="px-6 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-green-400 to-yellow-400 bg-clip-text text-transparent">
            Why Choose FitLife?
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Experience the future of fitness with AI-powered personalization that adapts to your unique journey
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={faDumbbell}
            iconColor="text-orange-400"
            iconBg="from-orange-500/20 to-red-500/20"
            title="Smart Workouts"
            description="AI-generated workout plans that evolve with your progress, fitness level, and available equipment."
            features={["Adaptive routines", "Form correction", "Progress tracking"]}
          />

          <FeatureCard
            icon={faAppleAlt}
            iconColor="text-green-400"
            iconBg="from-green-500/20 to-emerald-500/20"
            title="Nutrition Intelligence"
            description="Personalized meal plans with recipes tailored to your goals, dietary preferences, and lifestyle."
            features={["Macro tracking", "Recipe suggestions", "Shopping lists"]}
          />

          <FeatureCard
            icon={faRobot}
            iconColor="text-purple-400"
            iconBg="from-purple-500/20 to-pink-500/20"
            title="24/7 AI Coach"
            description="Your virtual fitness companion available anytime for guidance, motivation, and expert advice."
            features={["Real-time answers", "Motivation boost", "Form analysis"]}
          />
        </div>
      </section>

      {/* Premium Services - Enhanced */}
      <section className="px-6 py-24 bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Premium Features
            </h2>
            <p className="text-gray-400 text-lg">Unlock your full potential with our advanced tools</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Card 1 - Enhanced */}
            <PremiumCard
              icon={faChartLine}
              gradient="from-orange-500 via-pink-500 to-red-500"
              title="Advanced Analytics"
              description="Track every metric that matters with comprehensive analytics and insights into your fitness journey."
              features={[
                "Progress visualization",
                "Performance metrics",
                "Goal tracking",
                "Body composition analysis"
              ]}
              link="/routine"
              buttonText="View Analytics"
            />

            {/* Card 2 - Enhanced */}
            <PremiumCard
              icon={faUtensils}
              gradient="from-blue-500 via-purple-500 to-pink-500"
              title="AI Meal Planning"
              description="Get customized meal plans that adapt to your body type, fitness goals, and taste preferences."
              features={[
                "Personalized recipes",
                "Macro optimization",
                "Grocery automation",
                "Dietary restrictions"
              ]}
              link="/diet"
              buttonText="Create Plan"
            />
          </div>
        </div>
      </section>

      {/* Social Proof Section - New */}
      <section className="px-6 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold mb-4 text-white">
            Trusted by Fitness Enthusiasts
          </h2>
          <p className="text-gray-400 text-lg">Join thousands who've transformed their lives</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <TestimonialCard
            name="Sarah Johnson"
            role="Lost 30 lbs"
            image="👩"
            quote="FitLife's AI coaching helped me achieve what I couldn't do in years. The personalized plans actually work!"
            rating={5}
          />
          <TestimonialCard
            name="Mike Chen"
            role="Built Muscle"
            image="👨"
            quote="The workout routines adapt perfectly to my schedule and equipment. Best fitness app I've ever used."
            rating={5}
          />
          <TestimonialCard
            name="Emily Rodriguez"
            role="Marathon Runner"
            image="👩‍🦰"
            quote="From couch to marathon in 6 months! The progressive training plans are incredible."
            rating={5}
          />
        </div>
      </section>

      {/* CTA Section - New */}
      <section className="px-6 py-24 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-extrabold mb-6">
            Ready to Transform Your Life?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join FitLife today and get your personalized fitness plan in minutes
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="bg-white text-purple-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:scale-105"
            >
              Start Free Trial
            </Link>
            <Link
              to="/login"
              className="bg-white/10 backdrop-blur-lg border-2 border-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
            >
              Sign In
            </Link>
          </div>
          <p className="text-sm text-white/70 mt-6">
            No credit card required • Cancel anytime • 30-day money-back guarantee
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-6 py-20">
        <Contact />
      </section>
    </main>
  );
}

// Stat Card Component
function StatCard({ icon, value, label }) {
  return (
    <div className="text-center p-6 bg-black/40 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-white/20 transition-all hover:scale-105">
      <FontAwesomeIcon icon={icon} className="text-4xl mb-3 text-pink-500" />
      <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, iconColor, iconBg, title, description, features }) {
  return (
    <div className="group relative p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-md rounded-3xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${iconBg} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      
      <div className="relative z-10">
        <div className="mb-6 inline-block p-4 bg-gray-800/50 rounded-2xl">
          <FontAwesomeIcon icon={icon} className={`text-5xl ${iconColor}`} />
        </div>
        
        <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
          {title}
        </h3>
        
        <p className="text-gray-400 mb-6 leading-relaxed">
          {description}
        </p>
        
        <ul className="space-y-2">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-2 text-gray-300 text-sm">
              <span className="text-green-400">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Premium Card Component
function PremiumCard({ icon, gradient, title, description, features, link, buttonText }) {
  return (
    <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 hover:scale-105 group">
      {/* Top gradient bar */}
      <div className={`absolute top-0 left-0 right-0 h-2 rounded-t-3xl bg-gradient-to-r ${gradient}`}></div>
      
      <div className="mb-6">
        <FontAwesomeIcon icon={icon} className={`text-5xl text-transparent bg-clip-text bg-gradient-to-r ${gradient}`} />
      </div>
      
      <h3 className="text-3xl font-bold mb-4 text-white">{title}</h3>
      
      <p className="text-gray-300 mb-6 leading-relaxed">
        {description}
      </p>
      
      <ul className="space-y-3 mb-8">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-3 text-gray-300">
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradient}`}></div>
            {feature}
          </li>
        ))}
      </ul>
      
      <Link
        to={link}
        className={`inline-flex items-center gap-2 bg-gradient-to-r ${gradient} px-8 py-3 rounded-xl font-bold text-white hover:opacity-90 transition-all hover:scale-105 shadow-lg`}
      >
        {buttonText}
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </Link>
    </div>
  );
}

// Testimonial Card Component
function TestimonialCard({ name, role, image, quote, rating }) {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl border border-gray-700/50 hover:border-gray-600/50 transition-all hover:scale-105">
      <div className="flex items-center gap-4 mb-4">
        <div className="text-5xl">{image}</div>
        <div>
          <h4 className="font-bold text-white">{name}</h4>
          <p className="text-sm text-gray-400">{role}</p>
        </div>
      </div>
      
      <div className="flex mb-4">
        {[...Array(rating)].map((_, i) => (
          <FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400 text-sm" />
        ))}
      </div>
      
      <p className="text-gray-300 italic leading-relaxed">
        "{quote}"
      </p>
    </div>
  );
}
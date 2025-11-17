import React, { useState } from "react";
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaPaperPlane, FaCheckCircle, FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";

export default function About() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setSubmitted(true);
      setLoading(false);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({ name: "", email: "", message: "" });
        setSubmitted(false);
      }, 3000);
    }, 1000);
  };

  const teamMembers = [
    {
      name: "Bansi Vachhani",
      role: "Full Stack Developer",
      email: "bansivachhani153@gmail.com",
      avatar: "👩‍💻",
      linkedin: "#",
      github: "#"
    },
    {
      name: "Bhakti Kansagara",
      role: "Frontend Developer",
      email: "bhaktikansagara2004@gmail.com",
      avatar: "👨‍💻",
      linkedin: "#",
      github: "#"
    },
    {
      name: "Soni Hill",
      role: "Backend Developer",
      email: "hillsoni8104@gmail.com",
      avatar: "👨‍💻",
      linkedin: "#",
      github: "#"
    }
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            Get In Touch
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
            Have questions? Want to learn more about FitLife? We'd love to hear from you. 
            Our team is here to help you on your fitness journey.
          </p>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-3xl shadow-2xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 group text-center"
              >
                <div className="text-7xl mb-4 group-hover:scale-110 transition-transform">
                  {member.avatar}
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">
                  {member.name}
                </h3>
                <p className="text-purple-400 font-semibold mb-4">
                  {member.role}
                </p>
                <a
                  href={`mailto:${member.email}`}
                  className="text-blue-400 hover:text-blue-300 text-sm mb-4 block transition-colors"
                >
                  {member.email}
                </a>
                <div className="flex justify-center gap-4 mt-4">
                  <a
                    href={member.linkedin}
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <FaLinkedin size={20} />
                  </a>
                  <a
                    href={member.github}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <FaGithub size={20} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* Email Card */}
          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-blue-500/30 hover:border-blue-500/50 transition-all duration-500 hover:scale-105 group">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
              <FaEnvelope className="text-4xl text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-blue-400">Email Us</h3>
            <p className="text-gray-400 mb-4">
              Send us an email and we'll get back to you within 24 hours.
            </p>
            <div className="space-y-2">
              {teamMembers.map((member, idx) => (
                <a
                  key={idx}
                  href={`mailto:${member.email}`}
                  className="block text-blue-400 hover:text-blue-300 hover:translate-x-2 transition-all"
                >
                  → {member.email}
                </a>
              ))}
            </div>
          </div>

          {/* Phone Card */}
          <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-green-500/30 hover:border-green-500/50 transition-all duration-500 hover:scale-105 group">
            <div className="flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
              <FaPhone className="text-4xl text-green-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-green-400">Call Us</h3>
            <p className="text-gray-400 mb-4">
              Prefer to talk? Give us a call during business hours.
            </p>
            <a
              href="tel:+916593598924"
              className="text-2xl text-green-400 font-bold hover:text-green-300 transition-colors block"
            >
              +91 65935 98924
            </a>
            <p className="text-gray-500 text-sm mt-2">
              Mon-Fri: 9AM - 6PM IST
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-10 rounded-3xl shadow-2xl border border-gray-700/50">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                Send a Message
              </h3>
              <p className="text-gray-400">
                Fill out the form below and we'll respond as soon as possible
              </p>
            </div>

            {submitted ? (
              <div className="text-center py-12 animate-fade-in">
                <FaCheckCircle className="text-6xl text-green-400 mx-auto mb-4 animate-bounce" />
                <h4 className="text-2xl font-bold text-white mb-2">
                  Message Sent Successfully!
                </h4>
                <p className="text-gray-400">
                  Thank you for reaching out. We'll get back to you soon.
                </p>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Name */}
                <div className="group">
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold mb-2 text-gray-300 group-focus-within:text-pink-400 transition-colors"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl bg-gray-900/50 text-white border-2 border-gray-700 focus:border-pink-500 focus:outline-none placeholder-gray-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div className="group">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold mb-2 text-gray-300 group-focus-within:text-blue-400 transition-colors"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl bg-gray-900/50 text-white border-2 border-gray-700 focus:border-blue-500 focus:outline-none placeholder-gray-500 transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Message */}
                <div className="group">
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold mb-2 text-gray-300 group-focus-within:text-purple-400 transition-colors"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl bg-gray-900/50 text-white border-2 border-gray-700 focus:border-purple-500 focus:outline-none placeholder-gray-500 transition-all resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-8 rounded-xl font-bold text-lg bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <FaPaperPlane />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Location Section */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-3 bg-gray-800/50 backdrop-blur-lg px-6 py-3 rounded-full border border-gray-700">
            <FaMapMarkerAlt className="text-pink-400 text-xl" />
            <span className="text-gray-300">
              Based in <span className="font-bold text-white">India</span>
            </span>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12 flex justify-center gap-6">
          <a
            href="#"
            className="w-12 h-12 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all hover:scale-110"
          >
            <FaLinkedin className="text-xl" />
          </a>
          <a
            href="#"
            className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-all hover:scale-110"
          >
            <FaGithub className="text-xl" />
          </a>
          <a
            href="#"
            className="w-12 h-12 bg-gray-800 hover:bg-blue-400 rounded-full flex items-center justify-center transition-all hover:scale-110"
          >
            <FaTwitter className="text-xl" />
          </a>
        </div>
      </div>
    </section>
  );
}
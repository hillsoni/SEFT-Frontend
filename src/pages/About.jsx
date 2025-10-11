import React, { useState } from "react";
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaPaperPlane } from "react-icons/fa";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can integrate email API or Firebase, etc.
    console.log("Form submitted:", formData);
    alert("Message sent successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section
      id="contact"
      className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-16 px-6"
    >
      {/* Heading */}
      <div className="text-center mb-12 mt-8">
        <h2 className="text-4xl md:text-5xl font-bold text-pink-500">
          Get In Touch
        </h2>
        <p className="mt-4 text-gray-400 text-lg">
          Have questions? Want to learn more? Contact us today.
        </p>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
        {/* Email */}
        <div className="bg-[#1a1f2c] p-6 rounded-2xl shadow-lg text-center hover:scale-105 transition-transform">
          <FaEnvelope className="text-4xl mx-auto mb-4 text-pink-500" />
          <h3 className="text-lg font-semibold mb-2 text-orange-400">Email Us</h3>
          <div className="space-y-1">
            {[
              "bansivachhani153@gmail.com",
              "bhaktikansagara2004@gmail.com",
              "hillsoni8104@gmail.com",
            ].map((email) => (
              <a
                key={email}
                href={`mailto:${email}`}
                className="block text-blue-400 hover:underline"
              >
                {email}
              </a>
            ))}
          </div>
        </div>

        {/* Phone */}
        <div className="bg-[#1a1f2c] p-6 rounded-2xl shadow-lg text-center hover:scale-105 transition-transform">
          <FaPhone className="text-4xl mx-auto mb-4 text-purple-400" />
          <h3 className="text-lg font-semibold mb-2 text-orange-400">Call Us</h3>
          <a
            href="tel:+916593598924"
            className="text-green-400 font-medium hover:underline"
          >
            +91 65935 98924
          </a>
        </div>
      </div>

      {/* Contact Form */}
      <div className="max-w-3xl mx-auto bg-[#1a1f2c] p-8 rounded-2xl shadow-xl">
        <h3 className="text-xl font-bold mb-6 text-center text-orange-400">
          Send a Message
        </h3>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-2 text-gray-300"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-400"
              placeholder="Enter your name"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2 text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400"
              placeholder="Enter your email"
            />
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium mb-2 text-gray-300"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="4"
              required
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
              placeholder="Write your message..."
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 px-6 rounded-lg font-semibold bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 text-white flex items-center justify-center gap-2 hover:opacity-90 transition"
          >
            Send Message <FaPaperPlane />
          </button>
        </form>
      </div>
    </section>
  );
}

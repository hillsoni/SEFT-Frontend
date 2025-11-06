// Chatbot.jsx
import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Paperclip, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { chatbotAPI } from "../api";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const mediaRef = useRef(null);

  // Predefined suggestions
  const predefined = [
    "View my Goals",
    "Start Meditation",
    "Start Yoga",
    "Diet Plan Help",
    "Challenges",
  ];

  // Load chat history from backend on mount
  useEffect(() => {
    loadChatHistory();
    setMessages([
      {
        sender: "bot",
        type: "text",
        text: "Hi! I'm your AI Fitness Assistant 🤖. I can help you with diet and nutrition questions. How can I help you today?",
      },
    ]);
  }, []);

  const loadChatHistory = async () => {
    try {
      const response = await chatbotAPI.getHistory({ per_page: 10 });
      if (response.data.queries && response.data.queries.length > 0) {
        const historyMessages = response.data.queries
          .reverse()
          .flatMap((query) => [
            { sender: "user", type: "text", text: query.question },
            { sender: "bot", type: "text", text: query.answer },
          ]);
        setMessages((prev) => [...historyMessages, ...prev]);
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  };

  // Play bot voice
  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (text, type = "text") => {
    if (!text || loading) return;

    // Handle navigation commands (don't send to API)
    const lowerText = text.toLowerCase();
    if (
      lowerText === "view my goals" ||
      lowerText === "start meditation" ||
      lowerText === "start yoga" ||
      lowerText === "diet plan help" ||
      lowerText === "challenges"
    ) {
      let response = "";
      switch (lowerText) {
        case "view my goals":
          response = "Redirecting you to your Goals 🏆";
          window.location.href = "/dashboard";
          break;
        case "start meditation":
          response = "Let's start Meditation 🧘‍♂️";
          window.location.href = "/workout/meditation";
          break;
        case "start yoga":
          response = "Let's start Yoga 🧘‍♀️";
          window.location.href = "/workout/yoga";
          break;
        case "diet plan help":
          response = "I can guide you to your Diet Plan 🍎";
          window.location.href = "/diet";
          break;
        case "challenges":
          response = "Check your Fitness Challenges 🔥";
          window.location.href = "/workout/challenges";
          break;
      }
      const newMsg = { sender: "user", type, text };
      setMessages((prev) => [...prev, newMsg]);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", type: "text", text: response },
      ]);
      return;
    }

    // For text messages, send to backend API
    if (type === "text") {
      const newMsg = { sender: "user", type, text };
      setMessages((prev) => [...prev, newMsg]);
      setInput("");
      setLoading(true);

      try {
        const response = await chatbotAPI.sendQuery({
          question: text,
          query_type: "diet",
        });

        const botResponse = {
          sender: "bot",
          type: "text",
          text: response.data.answer,
        };

        setMessages((prev) => [...prev, botResponse]);
        speak(response.data.answer);
      } catch (error) {
        console.error("Chatbot error:", error);
        const errorMsg = {
          sender: "bot",
          type: "text",
          text:
            error.response?.data?.error ||
            error.response?.data?.message ||
            "I'm sorry, I can only answer diet and nutrition questions. Please ask me about food, meals, or nutrition! 🍎",
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setLoading(false);
      }
    } else {
      // For images and voice, just add to messages
      const newMsg = { sender: "user", type, text };
      setMessages((prev) => [...prev, newMsg]);
      setInput("");
    }
  };

  // Handle file uploads (images)
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => handleSend(reader.result, "image");
    reader.readAsDataURL(file);
  };

  // Handle voice recording
  const handleVoice = async () => {
    if (!recording) {
      setRecording(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        handleSend(url, "voice");
      };
      mediaRecorder.start();
      mediaRef.current = mediaRecorder;
    } else {
      setRecording(false);
      mediaRef.current.stop();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-[360px] sm:w-[420px] md:w-[480px] lg:w-[520px] bg-black rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-800 text-white p-5 flex justify-between items-center">
              <h3 className="font-semibold text-lg md:text-xl">Fitness Chatbot</h3>
              <button onClick={() => setOpen(false)}>
                <X className="w-6 h-6 md:w-7 md:h-7" />
              </button>
            </div>

            {/* Messages */}
            <div className="p-5 flex-1 overflow-y-auto h-[360px] sm:h-[400px] md:h-[450px] lg:h-[500px] space-y-3">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`${msg.sender === "user" ? "text-right" : "text-left"}`}
                >
                  {msg.type === "text" && (
                    <div
                      className={`inline-block p-3 md:p-4 rounded-2xl max-w-[80%] ${
                        msg.sender === "user"
                          ? "bg-blue-700 text-white"
                          : "bg-green-700 text-white"
                      }`}
                    >
                      {msg.text}
                    </div>
                  )}
                  {msg.type === "image" && (
                    <img
                      src={msg.text}
                      alt="uploaded"
                      className="inline-block max-w-[70%] md:max-w-[65%] rounded-xl border border-gray-700"
                    />
                  )}
                  {msg.type === "voice" && (
                    <audio
                      controls
                      src={msg.text}
                      className="inline-block max-w-[70%] md:max-w-[65%]"
                    />
                  )}
                </div>
              ))}
              {loading && (
                <div className="text-left">
                  <div className="inline-block p-3 md:p-4 rounded-2xl bg-green-700 text-white">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Predefined buttons */}
            <div className="p-4 flex flex-wrap gap-2 border-t border-gray-700">
              {predefined.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(item)}
                  className="bg-blue-600 text-white px-3 py-2 rounded-full hover:bg-blue-500 transition text-sm md:text-base"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Input + File + Voice */}
            <div className="p-5 border-t border-gray-700 flex gap-3 items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && handleSend(input)}
                placeholder="Type a message..."
                disabled={loading}
                className="flex-1 bg-gray-800 text-white rounded-3xl px-4 py-3 md:px-5 md:py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <label className="cursor-pointer">
                <Paperclip className="text-white w-6 h-6 md:w-7 md:h-7" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleVoice}
                className={`bg-green-600 px-4 py-3 md:px-5 md:py-4 rounded-2xl text-white hover:bg-green-500 transition`}
              >
                <Mic className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <button
                onClick={() => handleSend(input)}
                className="bg-green-600 px-5 py-3 md:px-6 md:py-4 rounded-2xl text-white hover:bg-green-500 transition"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-green-600 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-2xl hover:bg-green-500 transition"
        >
          <MessageSquare className="text-white w-7 h-7 md:w-8 md:h-8" />
        </button>
      )}
    </div>
  );
}

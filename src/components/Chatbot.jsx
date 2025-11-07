// Chatbot.jsx
import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Paperclip, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { chatbotAPI } from "../api";
import { extractUserInfo } from "../utils/infoExtractor";
import { useChatbot } from "../context/ChatbotContext";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const mediaRef = useRef(null);
  const dietInfoRef = useRef({});
  const { updateExtractedInfo, extractedInfo } = useChatbot();
  
  // Conversation state for diet plan generation
  const [isCollectingDietInfo, setIsCollectingDietInfo] = useState(false);
  const [dietInfoCollected, setDietInfoCollected] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  
  // Required fields for diet plan generation
  const dietQuestions = [
    { key: 'age', question: "What's your age? (in years)", type: 'number' },
    { key: 'gender', question: "What's your gender? (male/female/other)", type: 'select', options: ['male', 'female', 'other'] },
    { key: 'weight', question: "What's your weight? (in kg)", type: 'number' },
    { key: 'height', question: "What's your height? (in cm)", type: 'number' },
    { key: 'activity_level', question: "What's your activity level? (sedentary/light/moderate/active/very_active)", type: 'select', options: ['sedentary', 'light', 'moderate', 'active', 'very_active'] },
    { key: 'goal', question: "What's your fitness goal? (weight_loss/weight_gain/muscle_gain/maintenance)", type: 'select', options: ['weight_loss', 'weight_gain', 'muscle_gain', 'maintenance'] },
    { key: 'diet_type', question: "What's your preferred diet type? (vegetarian/non_vegetarian/vegan/keto/balanced)", type: 'select', options: ['vegetarian', 'non_vegetarian', 'vegan', 'keto', 'balanced'] },
    { key: 'duration', question: "What duration would you like? (1_week/1_month/3_months/6_months)", type: 'select', options: ['1_week', '1_month', '3_months', '6_months'] },
  ];

  // Predefined suggestions
  const predefined = [
    "Generate Diet Plan",
    "View my Goals",
    "Start Meditation",
    "Start Yoga",
    "Challenges",
  ];

  // Load chat history from backend on mount
  useEffect(() => {
    loadChatHistory();
    setMessages([
      {
        sender: "bot",
        type: "text",
        text: "Hi! I'm your AI Fitness Assistant 🤖. I can help you with fitness, diet, workouts, and yoga questions. Say 'generate diet plan' and I'll guide you through creating a personalized diet plan! How can I help you today?",
      },
    ]);
  }, []);

  // Start diet plan collection flow
  const startDietPlanCollection = () => {
    setIsCollectingDietInfo(true);
    setCurrentQuestionIndex(0);
    setDietInfoCollected({});
    dietInfoRef.current = {};
    
    const welcomeMsg = {
      sender: "bot",
      type: "text",
      text: "Great! Let's create your personalized diet plan 🥗. I'll ask you a few questions to customize it perfectly for you.",
    };
    setMessages((prev) => [...prev, welcomeMsg]);
    
    // Ask first question
    setTimeout(() => {
      askNextQuestion(0);
    }, 500);
  };

  // Ask the next question in sequence
  const askNextQuestion = (index) => {
    if (index >= dietQuestions.length) {
      // All questions answered, generate plan
      generateDietPlanFromCollectedInfo();
      return;
    }

    const question = dietQuestions[index];
    const questionMsg = {
      sender: "bot",
      type: "text",
      text: `${question.question}`,
    };
    setMessages((prev) => [...prev, questionMsg]);
    setCurrentQuestionIndex(index);
  };

  // Process answer and move to next question
  const processDietAnswer = (answer, questionIndex) => {
    const question = dietQuestions[questionIndex];
    let value = answer.trim();

    // Validate and parse answer based on type
    if (question.type === 'number') {
      // Extract number from text (e.g., "I'm 25" -> 25)
      const numMatch = value.match(/(\d+(?:\.\d+)?)/);
      if (numMatch) {
        value = parseFloat(numMatch[1]);
      } else {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
          const errorMsg = {
            sender: "bot",
            type: "text",
            text: `Please provide a valid number for ${question.key.replace('_', ' ')}.`,
          };
          setMessages((prev) => [...prev, errorMsg]);
          return false;
        }
        value = numValue;
      }
    } else if (question.type === 'select') {
      const lowerValue = value.toLowerCase();
      const matchedOption = question.options.find(opt => 
        lowerValue.includes(opt.toLowerCase()) || opt.toLowerCase().includes(lowerValue)
      );
      if (!matchedOption) {
        const errorMsg = {
          sender: "bot",
          type: "text",
          text: `Please choose one of: ${question.options.join(', ')}`,
        };
        setMessages((prev) => [...prev, errorMsg]);
        return false;
      }
      value = matchedOption;
    }

    // Save the answer
    const updated = { ...dietInfoCollected, [question.key]: value };
    setDietInfoCollected(updated);
    dietInfoRef.current = updated;
    updateExtractedInfo({ [question.key]: value });

    // Confirm and move to next question
    const confirmMsg = {
      sender: "bot",
      type: "text",
      text: `Got it! ${question.key.replace('_', ' ')}: ${value} ✓`,
    };
    setMessages((prev) => [...prev, confirmMsg]);

    // Ask next question
    setTimeout(() => {
      askNextQuestion(questionIndex + 1);
    }, 500);

    return true;
  };

  // Generate diet plan when all info is collected
  const generateDietPlanFromCollectedInfo = async () => {
    const generatingMsg = {
      sender: "bot",
      type: "text",
      text: "Perfect! I have all the information I need. Let me generate your personalized diet plan... 🍎✨",
    };
    setMessages((prev) => [...prev, generatingMsg]);
    setLoading(true);

    // Use ref to get the latest collected info
    const planData = { ...dietInfoRef.current };

    try {
      // Import dietAPI dynamically to avoid circular dependencies
      const { dietAPI } = await import("../api");
      
      const response = await dietAPI.generate(planData);
      const dietPlan = response.data.diet_plan;

      const successMsg = {
        sender: "bot",
        type: "text",
        text: "🎉 Your personalized diet plan has been generated successfully! I'm redirecting you to the Diet page to see your plan. Would you like me to help you with anything else?",
      };
      setMessages((prev) => [...prev, successMsg]);

      // Update extracted info with all collected data
      updateExtractedInfo(planData);

      // Navigate to diet page after a short delay
      setTimeout(() => {
        window.location.href = "/diet";
      }, 2000);

      setIsCollectingDietInfo(false);
      setCurrentQuestionIndex(-1);
      setDietInfoCollected({});
      dietInfoRef.current = {};
    } catch (error) {
      console.error("Diet plan generation error:", error);
      const errorMsg = {
        sender: "bot",
        type: "text",
        text: `Sorry, I couldn't generate your diet plan. ${error.response?.data?.error || error.message || "Please try again later."}`,
      };
      setMessages((prev) => [...prev, errorMsg]);
      setIsCollectingDietInfo(false);
      setCurrentQuestionIndex(-1);
    } finally {
      setLoading(false);
    }
  };

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

    const lowerText = text.toLowerCase();

    // Check if user wants to generate diet plan
    if (lowerText.includes('generate diet plan') || lowerText.includes('create diet plan') || 
        lowerText.includes('diet plan') && (lowerText.includes('generate') || lowerText.includes('create') || lowerText.includes('make'))) {
      const newMsg = { sender: "user", type, text };
      setMessages((prev) => [...prev, newMsg]);
      startDietPlanCollection();
      return;
    }

    // If collecting diet info, process as answer
    if (isCollectingDietInfo && currentQuestionIndex >= 0) {
      const newMsg = { sender: "user", type, text };
      setMessages((prev) => [...prev, newMsg]);
      processDietAnswer(text, currentQuestionIndex);
      return;
    }

    // Handle navigation commands (don't send to API)
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

      // Extract user information from the message (only if not in diet collection mode)
      if (!isCollectingDietInfo) {
        const extractedInfo = extractUserInfo(text);
        if (Object.keys(extractedInfo).length > 0) {
          updateExtractedInfo(extractedInfo);
          
          // Show confirmation message
          const confirmationMsg = {
            sender: "bot",
            type: "text",
            text: `Got it! I've saved: ${Object.entries(extractedInfo).map(([key, value]) => `${key.replace('_', ' ')}: ${value}`).join(', ')}. This will be used when you generate your diet plan! 📝`,
          };
          setMessages((prev) => [...prev, confirmationMsg]);
        }
      }

      try {
        const response = await chatbotAPI.sendQuery({
          question: text,
          query_type: "fitness",
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
            "I'm sorry, I can only answer fitness, diet, workout, and health-related questions. Please ask me something related to your fitness journey! 💪",
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

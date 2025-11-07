// Context to share extracted user info between chatbot and diet form
import React, { createContext, useContext, useState } from "react";

const ChatbotContext = createContext();

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
};

export const ChatbotProvider = ({ children }) => {
  const [extractedInfo, setExtractedInfo] = useState({});

  const updateExtractedInfo = (info) => {
    setExtractedInfo((prev) => ({ ...prev, ...info }));
  };

  const clearExtractedInfo = () => {
    setExtractedInfo({});
  };

  const value = {
    extractedInfo,
    updateExtractedInfo,
    clearExtractedInfo,
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
};


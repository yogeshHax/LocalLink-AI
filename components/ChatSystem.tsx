import React, { useState, useEffect, useRef } from 'react';
import { User, Message } from '../types';
import { Send, Phone, DollarSign, Clock, X, Bot, Minus, Maximize2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface ChatSystemProps {
  currentUser: User;
  activeChatUser: User | null; 
  onClose: () => void;
}

const ChatSystem: React.FC<ChatSystemProps> = ({ currentUser, activeChatUser, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize AI Client
  // Note: In a real production app, you might want to proxy this through a backend to hide the key, 
  // but for this prototype per instructions, we use process.env.API_KEY directly.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  useEffect(() => {
    if (activeChatUser) {
      // Reset chat when user changes
      const initialMsg = activeChatUser.id === 'ai-assistant' 
        ? "Hello! I'm your LocalLink Concierge. I can help you find services, explain how credits work, or verify a neighbor's trust score. How can I assist?"
        : `Hi ${currentUser.name.split(' ')[0]}! I saw your profile. How can we help each other?`;

      setMessages([
        {
          id: 'init-1',
          senderId: activeChatUser.id,
          receiverId: currentUser.id,
          text: initialMsg,
          timestamp: new Date(Date.now() - 1000 * 60 * 60), 
        }
      ]);
      setIsMinimized(false);
    }
  }, [activeChatUser, currentUser]);

  useEffect(() => {
    if (!isMinimized) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isMinimized, isTyping]);

  const generateAIResponse = async (userMessage: string) => {
    if (!activeChatUser) return;

    try {
        const model = ai.models.getGenerativeModel({ model: 'gemini-2.5-flash-latest' });
        
        // Construct a persona for the AI based on the mock user data
        let systemInstruction = "";
        
        if (activeChatUser.id === 'ai-assistant') {
             systemInstruction = `You are the LocalLink AI Assistant. Your job is to help users navigate the Open Innovation Skill Exchange.
             The platform uses dual-currency: USD and Time-Credits (1 hour = 1 credit).
             Users have Trust Scores based on ID verification.
             Be helpful, concise, and professional.`;
        } else {
             systemInstruction = `You are roleplaying as ${activeChatUser.name}, a user on LocalLink app.
             Your location: ${activeChatUser.location}.
             Your Trust Score: ${activeChatUser.trustScore}.
             Skills you offer: ${activeChatUser.skillsOffered.map(s => s.name).join(', ')}.
             Skills you need: ${activeChatUser.skillsNeeded.join(', ')}.
             
             The user ${currentUser.name} just sent you a message. 
             Respond naturally, casually, and helpfully. Keep it under 50 words.
             If they ask about price, mention your rates or credit value.
             If they ask about location, mention you are nearby.
             Do NOT say you are an AI. Stay in character as a neighbor.`;
        }

        const result = await model.generateContent({
            contents: [
                { role: 'user', parts: [{ text: systemInstruction + "\n\nUser said: " + userMessage }] }
            ]
        });
        
        return result.response.text();
    } catch (error) {
        console.error("AI Generation Error:", error);
        // Fallback if AI fails (e.g. invalid key)
        return "I'm having a bit of trouble connecting right now, but I'm interested! Can we talk later?";
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !activeChatUser) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: activeChatUser.id,
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    const userText = inputValue;
    setInputValue('');
    
    setIsTyping(true);

    // Call Gemini AI
    const replyText = await generateAIResponse(userText);
    
    // Slight artificial delay for realism if the API is too fast, but usually API takes a sec
    setIsTyping(false);
    
    if (replyText) {
        const response: Message = {
            id: (Date.now() + 1).toString(),
            senderId: activeChatUser.id,
            receiverId: currentUser.id,
            text: replyText.trim(),
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, response]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!activeChatUser) return null;

  // Minimized State
  if (isMinimized) {
      return (
        <div 
            className="fixed bottom-4 right-4 bg-indigo-600 text-white p-4 rounded-full shadow-2xl cursor-pointer hover:bg-indigo-700 transition-all z-[60] flex items-center gap-3 animate-bounce-in ring-4 ring-white"
            onClick={() => setIsMinimized(false)}
        >
            <div className="relative">
                <img src={activeChatUser.avatar} className="w-10 h-10 rounded-full border-2 border-white" alt="" />
                <div className="absolute top-0 right-0 w-3 h-3 bg-green-400 border border-indigo-600 rounded-full"></div>
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-sm leading-tight">{activeChatUser.name}</span>
                <span className="text-[10px] opacity-80">Click to expand</span>
            </div>
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.2rem] text-center">1</span>
        </div>
      );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-t-2xl rounded-bl-2xl shadow-2xl flex flex-col border border-gray-200 z-50 animate-[slideUp_0.3s_ease-out] overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-white p-4 border-b border-gray-100 flex justify-between items-center shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
             <img src={activeChatUser.avatar} className="w-10 h-10 rounded-full border-2 border-gray-100 object-cover" alt="" />
             <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1">
              {activeChatUser.name}
              {activeChatUser.id === 'ai-assistant' && <Sparkles className="w-3 h-3 text-purple-500 fill-current" />}
            </h3>
            <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Active Now
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
           <button onClick={() => setIsMinimized(true)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Minus className="w-4 h-4" /></button>
           <button onClick={onClose} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Negotiation Quick Actions */}
      <div className="bg-gray-50 border-b border-gray-200 p-3 flex gap-2 overflow-x-auto shrink-0 no-scrollbar">
        <button onClick={() => setInputValue("I'd like to make an offer of...")} className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all whitespace-nowrap shadow-sm active:scale-95 transform">
           <DollarSign className="w-3 h-3" /> Make Offer
        </button>
        <button onClick={() => setInputValue("Would you be interested in a skill swap?")} className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-all whitespace-nowrap shadow-sm active:scale-95 transform">
           <Clock className="w-3 h-3" /> Skill Swap
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        <div className="text-center text-xs text-gray-400 my-4 flex items-center justify-center gap-2">
            <span className="h-[1px] w-8 bg-gray-200"></span>
            <span className="bg-slate-100 px-2 py-1 rounded-full text-[10px] font-medium tracking-wide">
                {activeChatUser.id === 'ai-assistant' ? 'AI ASSISTANT ACTIVE' : 'ENCRYPTED CHAT'}
            </span>
            <span className="h-[1px] w-8 bg-gray-200"></span>
        </div>
        
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-[fadeIn_0.3s]`}>
              {!isMe && <img src={activeChatUser.avatar} className="w-6 h-6 rounded-full mr-2 self-end mb-1 border border-gray-200" />}
              <div 
                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  isMe 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                }`}
              >
                {msg.text}
                <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          );
        })}
        
        {isTyping && (
             <div className="flex justify-start animate-[fadeIn_0.3s]">
               <img src={activeChatUser.avatar} className="w-6 h-6 rounded-full mr-2 self-end mb-1" />
               <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                 <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                 <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                 <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
               </div>
             </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-200 shrink-0">
        <div className="relative flex items-center">
          <input
            type="text"
            className="w-full bg-gray-100 border-0 rounded-full pl-4 pr-12 py-3 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm shadow-inner text-gray-900 placeholder-gray-500 font-medium"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="absolute right-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all shadow-md transform active:scale-95 flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSystem;
import { useState, useEffect, useRef } from 'react';
import { X, Send, Loader } from 'lucide-react';

const ChatSupport = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const messagesEndRef = useRef(null);

  // Predefined responses from support team
  const supportResponses = {
    hello: "Hello! 👋 Welcome to Uber Support. How can I help you today?",
    booking: "To book a ride, go to your dashboard and click 'Book a Ride'. Select your pickup and dropoff locations, choose a ride type, and confirm.",
    payment: "We accept credit cards, debit cards, digital wallets, and cash payments. You can manage your payment methods in account settings.",
    rating: "After each ride, you'll receive a prompt to rate your driver. Your feedback helps us improve our service.",
    schedule: "You can schedule rides up to 30 days in advance. Select 'Schedule for Later' when booking.",
    lost_item: "If you lost something, contact your driver directly within 24 hours through the app, or reach out to us for help.",
    fare: "Fares are calculated based on distance, time, demand, and ride type. The estimated fare is shown before you book.",
    issue: "I'm sorry you're experiencing an issue. Could you provide more details? I'm here to help!",
    default: "Thank you for contacting Uber Support. How else can I assist you? 😊",
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Start chat with greeting
  useEffect(() => {
    if (isOpen && !chatStarted) {
      setMessages([
        {
          id: 1,
          text: "Hello! 👋 Welcome to Uber Support. I'm here to help. What can I assist you with today?",
          sender: 'support',
          timestamp: new Date(),
        },
      ]);
      setChatStarted(true);
    }
  }, [isOpen, chatStarted]);

  // Function to get smart response
  const getSmartResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('book') || lowerMessage.includes('ride')) {
      return supportResponses.booking;
    } else if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
      return supportResponses.payment;
    } else if (lowerMessage.includes('rating') || lowerMessage.includes('rate')) {
      return supportResponses.rating;
    } else if (lowerMessage.includes('schedule') || lowerMessage.includes('later')) {
      return supportResponses.schedule;
    } else if (lowerMessage.includes('lost') || lowerMessage.includes('left')) {
      return supportResponses.lost_item;
    } else if (lowerMessage.includes('fare') || lowerMessage.includes('price')) {
      return supportResponses.fare;
    } else if (
      lowerMessage.includes('problem') ||
      lowerMessage.includes('issue') ||
      lowerMessage.includes('error')
    ) {
      return supportResponses.issue;
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return supportResponses.hello;
    }

    return supportResponses.default;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate response delay (like real support team typing)
    setTimeout(() => {
      const supportMessage = {
        id: messages.length + 2,
        text: getSmartResponse(inputValue),
        sender: 'support',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, supportMessage]);
      setIsLoading(false);
    }, 800);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setMessages([]);
      setChatStarted(false);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-end md:justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={handleClose}
      ></div>

      {/* Chat Modal */}
      <div className="relative bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:w-96 h-screen md:h-[600px] flex flex-col z-10 animate-in slide-in-from-bottom">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-3xl md:rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Support Chat</h2>
            <p className="text-xs text-blue-100">We typically reply within 2 minutes</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-blue-500 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === 'user'
                      ? 'text-blue-100'
                      : 'text-gray-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-2xl rounded-bl-none">
                <div className="flex gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Support agent is typing...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4 bg-white rounded-b-3xl md:rounded-b-2xl">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2 text-center">
            This is an automated support assistant
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatSupport;

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';

export default function Chat() {
  const { user } = useAuth();
  const { messages, typingUsers, sendMessage, sendTyping, stopTyping } = useGame();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      console.log('Chat: Sending message:', input.trim());
      sendMessage(input.trim());
      setInput('');
      stopTyping();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    sendTyping();
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  };

  return (
    <div className="h-full flex flex-col bg-dark-surface/80 backdrop-blur-lg border border-dark-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-dark-border">
        <h2 className="text-lg font-display font-bold text-gray-300">Chat</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-8">
            No messages yet. Start the conversation!
          </div>
        )}
        <AnimatePresence>
          {messages.map((message, index) => {
            // Handle both message structures: direct (userId) or nested (sender.userId)
            const messageUserId = message.sender?.userId || message.userId;
            const messageUsername = message.sender?.username || message.username || 'Unknown';
            const messageText = message.message || message.text;
            const currentUserId = user?._id?.toString() || user?.userId?.toString();
            const isOwnMessage = messageUserId?.toString() === currentUserId;
            
            return (
              <motion.div
                key={message._id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-2 ${
                    isOwnMessage
                      ? 'bg-neon-purple/20 text-white'
                      : 'bg-dark-bg text-gray-300'
                  }`}
                >
                  {!isOwnMessage && messageUsername && (
                    <p className="text-xs text-neon-cyan mb-1">{messageUsername}</p>
                  )}
                  <p className="text-sm">{messageText}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {typingUsers.length > 0 && (
          <div className="text-xs text-gray-400 italic">
            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-dark-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all text-sm"
            maxLength={200}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-neon-purple text-white rounded-lg hover:bg-neon-purple/80 transition-colors font-display font-bold text-sm"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}


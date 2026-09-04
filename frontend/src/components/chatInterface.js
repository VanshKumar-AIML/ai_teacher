import React, { useEffect, useRef, useState } from 'react';

const ChatInterface = ({ sessionId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const ws = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!sessionId) return;
    const socket = new WebSocket(`ws://localhost:8000/api/ws/${sessionId}`);
    ws.current = socket;

    socket.onopen = () => {
      setConnected(true);
      setMessages([
        { type: 'system', content: '👋 Welcome! Your AI Teacher is ready. The lesson will begin shortly.' }
      ]);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'question' || data.type === 'explain' || data.type === 'feedback') {
        setMessages(prev => [...prev, { type: 'teacher', content: data.content }]);
      } else {
        setMessages(prev => [...prev, { type: 'system', content: data.content }]);
      }
      setTyping(false);
    };

    socket.onclose = () => {
      setConnected(false);
      setMessages(prev => [...prev, { type: 'system', content: '⚠️ Connection lost. Please refresh.' }]);
    };

    return () => socket.close();
  }, [sessionId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN && input.trim()) {
      ws.current.send(JSON.stringify({ answer: input }));
      setMessages(prev => [...prev, { type: 'user', content: input }]);
      setInput('');
      setTyping(true);
    }
  };

  const handleKeyPress = (e) => e.key === 'Enter' && sendMessage();

  return (
    <div className="my-6 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-gray-800/50">
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="font-semibold text-gray-700 dark:text-gray-300">Interactive Chat</span>
        </div>
        <span className={`text-xs ${connected ? 'text-green-500' : 'text-red-500'}`}>
          ● {connected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      <div className="h-80 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900/30">
        {messages.map((msg, idx) => {
          const isUser = msg.type === 'user';
          const isTeacher = msg.type === 'teacher';
          const isSystem = msg.type === 'system';
          return (
            <div
              key={idx}
              className={`message-enter mb-3 flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {isSystem && (
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center w-full mb-1">{msg.content}</div>
              )}
              {!isSystem && (
                <div
                  className={`max-w-xs md:max-w-md px-4 py-2.5 rounded-2xl shadow-sm ${
                    isUser
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-br-none'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-none'
                  }`}
                >
                  {msg.content}
                </div>
              )}
            </div>
          );
        })}
        {typing && (
          <div className="flex justify-start mb-3">
            <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2.5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 rounded-bl-none">
              <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mr-1 animate-bounce"></span>
              <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mr-1 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="flex items-center p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={connected ? "Type your answer..." : "Disconnected..."}
          disabled={!connected}
          className="flex-1 p-2 bg-transparent border-0 focus:ring-0 outline-none text-gray-800 dark:text-gray-200"
        />
        <button
          onClick={sendMessage}
          disabled={!connected || !input.trim()}
          className="ml-2 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition shadow-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
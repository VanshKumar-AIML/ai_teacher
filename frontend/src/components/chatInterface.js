import React, { useEffect, useRef, useState } from 'react';

const ChatInterface = ({ sessionId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const ws = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    const socket = new WebSocket(`ws://localhost:8000/api/ws/${sessionId}`);
    ws.current = socket;
    socket.onopen = () => {
      setConnected(true);
      setMessages([{ type: 'system', content: 'Connected to AI Teacher. Please wait for the lesson to start.' }]);
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prev => [...prev, data]);
    };
    socket.onclose = () => setConnected(false);
    return () => socket.close();
  }, [sessionId]);

  const sendAnswer = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN && input.trim()) {
      ws.current.send(JSON.stringify({ answer: input }));
      setMessages(prev => [...prev, { type: 'user', content: input }]);
      setInput('');
    }
  };

  return (
    <div className="my-4 border rounded p-2">
      <h2 className="text-xl font-semibold">Interactive Chat</h2>
      <div className="h-64 overflow-y-auto bg-gray-50 p-2 rounded">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-1 ${msg.type === 'user' ? 'text-right' : ''}`}>
            <span className={`inline-block px-3 py-1 rounded ${msg.type === 'user' ? 'bg-blue-100' : 'bg-gray-200'}`}>
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <div className="flex mt-2">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded-l"
          placeholder="Type your answer or question..."
          disabled={!connected}
        />
        <button 
          onClick={sendAnswer} 
          className="px-4 py-2 bg-indigo-500 text-white rounded-r"
          disabled={!connected}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
import React, { useState } from 'react';

const LessonSettings = ({ onGenerate, loading }) => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('beginner');
  const [time, setTime] = useState(20);
  const [language, setLanguage] = useState('en');

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(topic, { level, time_minutes: time, language });
  };

  return (
    <div className="mb-6 p-4 border rounded">
      <h2 className="text-xl font-semibold mb-2">Lesson Settings</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block text-sm font-medium">Topic (optional if file uploaded)</label>
          <input 
            type="text" 
            value={topic} 
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g., Machine Learning, Newton's Laws"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Level</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full p-2 border rounded">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Time (minutes)</label>
            <input 
              type="number" 
              value={time} 
              onChange={(e) => setTime(Number(e.target.value))}
              className="w-full p-2 border rounded"
              min="5"
              max="120"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full p-2 border rounded">
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="mt-4 px-6 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Lesson'}
        </button>
      </form>
    </div>
  );
};

export default LessonSettings;
import React, { useState } from 'react';
import Upload from './components/Upload';
import LessonSettings from './components/LessonSettings';
import VideoPlayer from './components/VideoPlayer';
import ChatInterface from './components/ChatInterface';
import Assessment from './components/Assessment';
import { generateLesson, generateVideo } from './api';

function App() {
  const [lessonPlan, setLessonPlan] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [fileText, setFileText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (topic, settings) => {
    setLoading(true);
    try {
      // If file was uploaded, we have fileText
      const plan = await generateLesson({ ...settings, topic, file_content: fileText });
      setLessonPlan(plan);
      const videoRes = await generateVideo(plan, settings.language);
      setVideoUrl(videoRes.video_url);
      setSessionId(videoRes.session_id);
    } catch (error) {
      alert('Error generating lesson: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">AI Teacher</h1>
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <Upload onTextExtracted={setFileText} />
        <LessonSettings onGenerate={handleGenerate} loading={loading} />
        {videoUrl && (
          <VideoPlayer url={videoUrl} />
        )}
        {sessionId && (
          <ChatInterface sessionId={sessionId} />
        )}
        {lessonPlan && (
          <Assessment lessonPlan={lessonPlan} sessionId={sessionId} />
        )}
      </div>
    </div>
  );
}

export default App;
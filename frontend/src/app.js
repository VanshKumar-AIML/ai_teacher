import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Upload from './components/Upload';
import LessonSettings from './components/LessonSettings';
import VideoPlayer from './components/VideoPlayer';
import ChatInterface from './components/ChatInterface';
import Assessment from './components/Assessment';
import { generateLesson, generateVideo } from './api';

// Inner component to use theme
const AppContent = () => {
  const { theme, toggleTheme } = useTheme();
  const [lessonPlan, setLessonPlan] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [fileText, setFileText] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGenerate = async (topic, settings) => {
    setLoading(true);
    setProgress(10);
    try {
      const plan = await generateLesson({ ...settings, topic, file_content: fileText });
      setProgress(50);
      setLessonPlan(plan);
      const videoRes = await generateVideo(plan, settings.language);
      setProgress(100);
      setVideoUrl(videoRes.video_url);
      setSessionId(videoRes.session_id);
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setLoading(false);
    setProgress(0);
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header with theme toggle */}
      <header className="sticky top-0 z-50 glass border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-2xl font-extrabold gradient-text">AI Teacher</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden md:inline">Learn anything, anywhere</span>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="glass rounded-2xl shadow-xl p-6 md:p-8 animate-fade-in-up">
          <Upload onTextExtracted={setFileText} />
          <LessonSettings onGenerate={handleGenerate} loading={loading} />

          {loading && progress > 0 && (
            <div className="mt-6">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Generating lesson... {progress}%</p>
            </div>
          )}

          {videoUrl && (
            <div className="mt-6">
              <VideoPlayer url={videoUrl} />
            </div>
          )}
          {sessionId && (
            <div className="mt-6">
              <ChatInterface sessionId={sessionId} />
            </div>
          )}
          {lessonPlan && (
            <div className="mt-6">
              <Assessment lessonPlan={lessonPlan} sessionId={sessionId} />
            </div>
          )}
        </div>
      </main>

      <footer className="mt-12 py-4 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
        © {new Date().getFullYear()} AI Teacher – Built with ❤️ for the future of education
      </footer>
    </div>
  );
};

// Wrap with ThemeProvider
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
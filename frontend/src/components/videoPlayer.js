import React, { useState } from 'react';
import VideoJS from 'react-video-js-player';

const VideoPlayer = ({ url }) => {
  const [loading, setLoading] = useState(true);

  if (!url) return null;

  return (
    <div className="my-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
        <svg className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        Video Lesson
      </h2>
      <div className="relative rounded-xl overflow-hidden shadow-lg bg-black">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/60 z-10">
            <div className="spinner"></div>
          </div>
        )}
        <VideoJS
          src={url}
          controls
          width="100%"
          height="auto"
          onCanPlay={() => setLoading(false)}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
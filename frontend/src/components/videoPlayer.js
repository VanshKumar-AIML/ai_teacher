import React from 'react';
import VideoJS from 'react-video-js-player';

const VideoPlayer = ({ url }) => {
  if (!url) return null;
  return (
    <div className="my-4">
      <h2 className="text-xl font-semibold mb-2">Video Lesson</h2>
      <VideoJS 
        src={url}
        controls
        width="100%"
        height="auto"
      />
    </div>
  );
};

export default VideoPlayer;
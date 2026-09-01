import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000/api';

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`${API_BASE}/upload`, formData);
  return response.data;
};

export const generateLesson = async (settings) => {
  const response = await axios.post(`${API_BASE}/lesson`, settings);
  return response.data;
};

export const generateVideo = async (lessonPlan, language) => {
  const response = await axios.post(`${API_BASE}/video`, {
    lesson_plan: lessonPlan,
    language: language || 'en'
  });
  return response.data;
};

export const submitAssessment = async (sessionId, answers) => {
  const response = await axios.post(`${API_BASE}/assessment`, {
    session_id: sessionId,
    answers
  });
  return response.data;
};
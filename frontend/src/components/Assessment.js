import React, { useState } from 'react';
import { submitAssessment } from '../api';

const Assessment = ({ lessonPlan, sessionId }) => {
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (!sessionId) return;
    const res = await submitAssessment(sessionId, answers);
    setResult(res);
    setSubmitted(true);
  };

  if (!lessonPlan || !lessonPlan.quiz) return null;

  return (
    <div className="my-4 p-4 border rounded">
      <h2 className="text-xl font-semibold">Quiz</h2>
      {!submitted ? (
        <>
          {lessonPlan.quiz.map((q, idx) => (
            <div key={idx} className="mb-4">
              <p className="font-medium">{idx+1}. {q.question}</p>
              {q.options ? (
                <div className="ml-4">
                  {q.options.map((opt, oi) => (
                    <label key={oi} className="block">
                      <input 
                        type="radio" 
                        name={`q${idx}`} 
                        value={opt} 
                        onChange={() => handleAnswerChange(idx, opt)}
                      /> {opt}
                    </label>
                  ))}
                </div>
              ) : (
                <input 
                  type="text" 
                  className="w-full p-1 border rounded mt-1"
                  onChange={(e) => handleAnswerChange(idx, e.target.value)}
                  placeholder="Your answer"
                />
              )}
            </div>
          ))}
          <button 
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-500 text-white rounded"
          >
            Submit Quiz
          </button>
        </>
      ) : (
        <div>
          <p><strong>Score:</strong> {result?.score}%</p>
          <p><strong>Strengths:</strong> {result?.strengths.join(', ') || 'None'}</p>
          <p><strong>Weak areas:</strong> {result?.weaknesses.join(', ') || 'None'}</p>
          <p><strong>Recommendation:</strong> {result?.recommendation}</p>
        </div>
      )}
    </div>
  );
};

export default Assessment;
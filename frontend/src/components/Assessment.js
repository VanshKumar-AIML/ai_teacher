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
    <div className="my-6 p-5 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm bg-gray-50 dark:bg-gray-800/30">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        Quiz
      </h2>

      {!submitted ? (
        <>
          <div className="space-y-4">
            {lessonPlan.quiz.map((q, idx) => (
              <div key={idx} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="font-medium text-gray-800 dark:text-gray-200">{idx+1}. {q.question}</p>
                {q.options ? (
                  <div className="ml-4 mt-2 space-y-1">
                    {q.options.map((opt, oi) => (
                      <label key={oi} className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                        <input
                          type="radio"
                          name={`q${idx}`}
                          value={opt}
                          onChange={() => handleAnswerChange(idx, opt)}
                          className="form-radio text-indigo-600"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    className="mt-2 w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                    placeholder="Type your answer..."
                  />
                )}
              </div>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            className="mt-5 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md"
          >
            Submit Quiz
          </button>
        </>
      ) : (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">Score</span>
            <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{result?.score}%</span>
          </div>
          <div className="mt-3 space-y-1">
            <p className="text-gray-700 dark:text-gray-300"><strong>Strengths:</strong> {result?.strengths.join(', ') || 'None'}</p>
            <p className="text-gray-700 dark:text-gray-300"><strong>Weak areas:</strong> {result?.weaknesses.join(', ') || 'None'}</p>
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-gray-800 dark:text-gray-200"><strong>📌 Recommendation:</strong> {result?.recommendation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assessment;
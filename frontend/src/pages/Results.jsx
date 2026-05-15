import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../api/api";

function Results() {
  const { pollId } = useParams();
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.get(`/responses/${pollId}/results`);
        setResults(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load results");
      }
    };

    fetchResults();
  }, [pollId]);

  if (error) {
    return (
      <div className="px-6 py-12 text-center">
        <h2 className="text-2xl font-bold text-slate-800">{error}</h2>
        <p className="text-slate-500 mt-2">
          Results will appear here after the poll creator publishes them.
        </p>
      </div>
    );
  }

  if (!results) {
    return <div className="p-8 text-center">Loading results...</div>;
  }

  return (
    <div className="px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow p-8">
          <h2 className="text-3xl font-bold text-slate-800">
            {results.pollTitle}
          </h2>

          <p className="text-slate-500 mt-2">{results.description}</p>

          <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-xl p-5">
            <p className="text-sm text-indigo-700">Total Responses</p>
            <h3 className="text-3xl font-bold text-indigo-700 mt-1">
              {results.totalResponses}
            </h3>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {results.questions.map((question, index) => (
            <div key={question.questionId} className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-bold text-slate-800">
                {index + 1}. {question.questionText}
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                {question.totalAnswers} answers submitted
              </p>

              <div className="mt-5 space-y-4">
                {question.options.map((option) => {
                  const percentage =
                    question.totalAnswers === 0
                      ? 0
                      : Math.round((option.count / question.totalAnswers) * 100);

                  return (
                    <div key={option.option}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-slate-700">
                          {option.option}
                        </span>

                        <span className="text-slate-500">
                          {option.count} votes • {percentage}%
                        </span>
                      </div>

                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div
                          className="bg-indigo-600 h-3 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Results;
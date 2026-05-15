import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import socket from "../socket";

function Analytics() {
  const { pollId } = useParams();
  const [analytics, setAnalytics] = useState(null);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get(`/responses/${pollId}/analytics`);
      setAnalytics(response.data);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load analytics");
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [pollId]);

  useEffect(() => {
    socket.on("responseSubmitted", (data) => {
      if (data.pollId === pollId) {
        fetchAnalytics();
      }
    });

    return () => {
      socket.off("responseSubmitted");
    };
  }, [pollId]);

  const publishResults = async () => {
    try {
      await api.patch(`/polls/${pollId}/publish`);

      alert("Results published successfully!");
      fetchAnalytics();
    } catch (error) {
      alert(error.response?.data?.message || "Publish failed");
    }
  };

  if (!analytics) {
    return <div className="p-8 text-center">Loading analytics...</div>;
  }

  return (
    <div className="px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-800">
          Analytics Dashboard
        </h2>

        <p className="text-slate-500 mt-2">
          Response summary for {analytics.pollTitle}
        </p>

        <div className="grid md:grid-cols-3 gap-5 mt-8">
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-slate-500 text-sm">Total Responses</p>
            <h3 className="text-3xl font-bold text-indigo-600 mt-2">
              {analytics.totalResponses}
            </h3>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-slate-500 text-sm">Total Questions</p>
            <h3 className="text-3xl font-bold text-indigo-600 mt-2">
              {analytics.questions.length}
            </h3>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-slate-500 text-sm">Result Status</p>
            <h3
              className={`text-2xl font-bold mt-2 ${
                analytics.isPublished ? "text-green-600" : "text-orange-500"
              }`}
            >
              {analytics.isPublished ? "Published" : "Draft"}
            </h3>
          </div>
        </div>

        <div className="mt-10 space-y-6">
          {analytics.questions.map((question, index) => (
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

        {!analytics.isPublished && (
          <button
            onClick={publishResults}
            className="mt-8 bg-indigo-600 hover:bg-indigo-700 transition text-white px-6 py-3 rounded-lg font-semibold"
          >
            Publish Final Results
          </button>
        )}
      </div>
    </div>
  );
}

export default Analytics;
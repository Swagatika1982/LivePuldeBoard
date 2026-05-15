import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../api/api";

function PublicPoll() {
  const { pollId } = useParams();

  const [poll, setPoll] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await api.get(`/polls/public/${pollId}`);
        setPoll(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Poll not found");
      }
    };

    fetchPoll();
  }, [pollId]);

  const handleAnswerChange = (questionId, option) => {
    setAnswers({
      ...answers,
      [questionId]: option,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (let question of poll.questions) {
      if (question.isMandatory && !answers[question._id]) {
        toast.error(`Please answer: ${question.questionText}`);
        return;
      }
    }

    const formattedAnswers = Object.keys(answers).map((questionId) => ({
      questionId,
      selectedOption: answers[questionId],
    }));

    try {
      await api.post(`/responses/${pollId}`, { answers: formattedAnswers, });

      setSubmitted(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Response submit failed");
    }
  };

  if (!poll) {
    return <div className="p-8 text-center">Loading poll...</div>;
  }

  if (poll.isExpired) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600">
          This poll has expired.
        </h2>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="px-6 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-8 text-center">
          <h2 className="text-3xl font-bold text-green-600">Thank You!</h2>

          <p className="text-slate-600 mt-3">
            Your response has been submitted successfully.
          </p>

          <Link
            to={`/results/${pollId}`}
            className="inline-block mt-6 bg-indigo-600 text-white px-5 py-3 rounded-lg font-semibold"
          >
            View Results
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
        <h2 className="text-3xl font-bold text-slate-800">{poll.title}</h2>

        <p className="text-slate-500 mt-2">{poll.description}</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {poll.questions.map((question, index) => (
            <div
              key={question._id}
              className="border border-slate-200 rounded-xl p-5 bg-slate-50"
            >
              <h3 className="font-semibold text-slate-800 mb-4">
                {index + 1}. {question.questionText}
                {question.isMandatory && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </h3>

              <div className="space-y-3">
                {question.options.map((option) => (
                  <label
                    key={option._id}
                    className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-4 py-3 cursor-pointer hover:border-indigo-400"
                  >
                    <input
                      type="radio"
                      name={question._id}
                      value={option.text}
                      checked={answers[question._id] === option.text}
                      onChange={() =>
                        handleAnswerChange(question._id, option.text)
                      }
                    />

                    <span className="text-slate-700">{option.text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
          >
            Submit Response
          </button>
        </form>
      </div>
    </div>
  );
}

export default PublicPoll;
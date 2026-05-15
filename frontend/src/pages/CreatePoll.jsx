import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../api/api";


function CreatePoll() {
  const navigate = useNavigate();

  const [poll, setPoll] = useState({
    title: "",
    description: "",
    responseMode: "anonymous",
    expiresAt: "",
  });

  const [questions, setQuestions] = useState([
    {
      questionText: "",
      isMandatory: true,
      options: ["", ""],
    },
  ]);

  const handlePollChange = (e) => {
    setPoll({
      ...poll,
      [e.target.name]: e.target.value,
    });
  };

  const handleQuestionChange = (questionIndex, value) => {
    const updated = [...questions];
    updated[questionIndex].questionText = value;
    setQuestions(updated);
  };

  const handleMandatoryChange = (questionIndex) => {
    const updated = [...questions];
    updated[questionIndex].isMandatory = !updated[questionIndex].isMandatory;
    setQuestions(updated);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        isMandatory: true,
        options: ["", ""],
      },
    ]);
  };

  const addOption = (questionIndex) => {
    const updated = [...questions];
    updated[questionIndex].options.push("");
    setQuestions(updated);
  };

  const removeQuestion = (questionIndex) => {
    if (questions.length === 1) {
      toast.error("At least one question is required");
      return;
    }

    const updated = questions.filter((_, index) => index !== questionIndex);
    setQuestions(updated);
  };

  const removeOption = (questionIndex, optionIndex) => {
    if (questions[questionIndex].options.length === 2) {
      toast.error("Each question must have at least 2 options");
      return;
    }

    const updated = [...questions];
    updated[questionIndex].options = updated[questionIndex].options.filter(
      (_, index) => index !== optionIndex
    );

    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!poll.title.trim()) {
      toast.error("Please enter poll title");
      return;
    }

    if (!poll.expiresAt) {
      toast.error("Please select expiry date and time");
      return;
    }

    for (let question of questions) {
      if (!question.questionText.trim()) {
        toast.error("Please enter all question text");
        return;
      }

      const validOptions = question.options.filter(
        (option) => option.trim() !== ""
      );

      if (validOptions.length < 2) {
        toast.error("Each question must have at least 2 options");
        return;
      }
    }

    try {
      const formattedQuestions = questions.map((question) => ({
        questionText: question.questionText,
        isMandatory: question.isMandatory,
        options: question.options.filter(
          (option) => option.trim() !== ""
        ),
      }));

      const pollData = {
        ...poll,
        questions: formattedQuestions,
      };

      await api.post("/polls", pollData);

      toast.success("Poll created successfully!");

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Create poll failed"
      );
    }
  };

  return (
    <div className="px-6 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8">
        <h2 className="text-3xl font-bold text-slate-800">
          Create New Poll
        </h2>

        <p className="text-slate-500 mt-2">
          Add poll details, questions, options, and expiry time.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Poll Title
            </label>
            <input
              type="text"
              name="title"
              value={poll.title}
              onChange={handlePollChange}
              placeholder="Example: Student Feedback Poll"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={poll.description}
              onChange={handlePollChange}
              placeholder="Write a short description"
              rows="3"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Response Mode
              </label>
              <select
                name="responseMode"
                value={poll.responseMode}
                onChange={handlePollChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="anonymous">Anonymous</option>
                <option value="authenticated">Authenticated</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Expiry Date & Time
              </label>
              <input
                type="datetime-local"
                name="expiresAt"
                value={poll.expiresAt}
                onChange={handlePollChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-5">
            {questions.map((question, questionIndex) => (
              <div
                key={questionIndex}
                className="border border-slate-200 rounded-xl p-5 bg-slate-50"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-slate-800">
                    Question {questionIndex + 1}
                  </h3>

                  <div className="flex items-center gap-4">
                    <label className="text-sm text-slate-600 flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={question.isMandatory}
                        onChange={() => handleMandatoryChange(questionIndex)}
                      />
                      Mandatory
                    </label>

                    <button
                      type="button"
                      onClick={() => removeQuestion(questionIndex)}
                      className="text-sm text-red-600 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  value={question.questionText}
                  onChange={(e) =>
                    handleQuestionChange(questionIndex, e.target.value)
                  }
                  placeholder="Enter your question"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                />

                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex gap-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(
                            questionIndex,
                            optionIndex,
                            e.target.value
                          )
                        }
                        placeholder={`Option ${optionIndex + 1}`}
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                      />

                      <button
                        type="button"
                        onClick={() => removeOption(questionIndex, optionIndex)}
                        className="px-3 rounded-lg bg-red-100 text-red-600 font-semibold"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => addOption(questionIndex)}
                  className="mt-4 text-indigo-600 font-semibold"
                >
                  + Add Option
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={addQuestion}
              className="border border-indigo-600 text-indigo-600 px-5 py-3 rounded-lg font-semibold"
            >
              + Add Question
            </button>

            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700"
            >
              Create Poll
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePoll;
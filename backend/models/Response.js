const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  selectedOption: {
    type: String,
    required: true,
  },
});

const responseSchema = new mongoose.Schema(
  {
    poll: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll",
      required: true,
    },

    respondent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    answers: [answerSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Response", responseSchema);
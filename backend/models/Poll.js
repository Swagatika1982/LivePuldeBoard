const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
});

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },

  isMandatory: {
    type: Boolean,
    default: true,
  },

  options: [optionSchema],
});

const pollSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    responseMode: {
      type: String,
      enum: ["anonymous", "authenticated"],
      default: "anonymous",
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    questions: [questionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Poll", pollSchema);
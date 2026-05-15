const express = require("express");

const Poll = require("../models/Poll");
const Response = require("../models/Response");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }

    return protect(req, res, next);
  } catch {
    req.user = null;
    next();
  }
};

router.post("/:pollId", optionalAuth, async (req, res) => {
  try {
    const { answers } = req.body;

    const poll = await Poll.findById(req.params.pollId);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    if (new Date(poll.expiresAt) < new Date()) {
      return res.status(400).json({ message: "Poll has expired" });
    }

    if (poll.responseMode === "authenticated" && !req.user) {
      return res.status(401).json({
        message: "Login required to submit this poll",
      });
    }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Answers are required" });
    }

    if (poll.responseMode === "authenticated") {
      const existingResponse = await Response.findOne({
        poll: poll._id,
        respondent: req.user._id,
      });

      if (existingResponse) {
        return res.status(400).json({
          message: "You have already submitted this poll",
        });
      }
    }

    for (let question of poll.questions) {
      const answer = answers.find(
        (item) => item.questionId === question._id.toString()
      );

      if (question.isMandatory && !answer) {
        return res.status(400).json({
          message: `Mandatory question missing: ${question.questionText}`,
        });
      }

      if (answer) {
        const validOption = question.options.some(
          (option) => option.text === answer.selectedOption
        );

        if (!validOption) {
          return res.status(400).json({
            message: "Invalid selected option",
          });
        }
      }
    }

    const response = await Response.create({
      poll: poll._id,
      respondent: req.user ? req.user._id : null,
      answers,
    });

    const io = req.app.get("io");

    io.emit("responseSubmitted", {
      pollId: poll._id,
    });

    res.status(201).json({
      message: "Response submitted successfully",
      response,
    });
  } catch (error) {
    res.status(500).json({
      message: "Submit response failed",
      error: error.message,
    });
  }
});

router.get("/:pollId/analytics", protect, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.pollId);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    if (poll.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only poll creator can view analytics",
      });
    }

    const responses = await Response.find({ poll: poll._id });

    const questionSummaries = poll.questions.map((question) => {
      const optionCounts = question.options.map((option) => {
        const count = responses.filter((response) =>
          response.answers.some(
            (answer) =>
              answer.questionId.toString() === question._id.toString() &&
              answer.selectedOption === option.text
          )
        ).length;

        return {
          option: option.text,
          count,
        };
      });

      return {
        questionId: question._id,
        questionText: question.questionText,
        isMandatory: question.isMandatory,
        totalAnswers: responses.filter((response) =>
          response.answers.some(
            (answer) => answer.questionId.toString() === question._id.toString()
          )
        ).length,
        options: optionCounts,
      };
    });

    res.json({
      pollId: poll._id,
      pollTitle: poll.title,
      isPublished: poll.isPublished,
      totalResponses: responses.length,
      questions: questionSummaries,
    });
  } catch (error) {
    res.status(500).json({
      message: "Analytics failed",
      error: error.message,
    });
  }
});

router.get("/:pollId/results", async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.pollId);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    if (!poll.isPublished) {
      return res.status(403).json({
        message: "Results are not published yet",
      });
    }

    const responses = await Response.find({ poll: poll._id });

    const questionSummaries = poll.questions.map((question) => {
      const optionCounts = question.options.map((option) => {
        const count = responses.filter((response) =>
          response.answers.some(
            (answer) =>
              answer.questionId.toString() === question._id.toString() &&
              answer.selectedOption === option.text
          )
        ).length;

        return {
          option: option.text,
          count,
        };
      });

      return {
        questionId: question._id,
        questionText: question.questionText,
        totalAnswers: responses.filter((response) =>
          response.answers.some(
            (answer) => answer.questionId.toString() === question._id.toString()
          )
        ).length,
        options: optionCounts,
      };
    });

    res.json({
      pollId: poll._id,
      pollTitle: poll.title,
      description: poll.description,
      totalResponses: responses.length,
      questions: questionSummaries,
    });
  } catch (error) {
    res.status(500).json({
      message: "Results failed",
      error: error.message,
    });
  }
});

module.exports = router;
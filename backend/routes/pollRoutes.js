const express = require("express");

const Poll = require("../models/Poll");
const Response = require("../models/Response");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { title, description, responseMode, expiresAt, questions } = req.body;

    if (!title || !expiresAt || !questions || questions.length === 0) {
      return res.status(400).json({ message: "Missing required poll fields" });
    }

    for (let question of questions) {
      if (!question.questionText || !question.options || question.options.length < 2) {
        return res.status(400).json({
          message: "Each question must have text and at least 2 options",
        });
      }
    }

    const formattedQuestions = questions.map((question) => ({
      questionText: question.questionText,
      isMandatory: question.isMandatory,
      options: question.options.map((option) => ({
        text: typeof option === "string" ? option : option.text,
      })),
    }));

    const poll = await Poll.create({
      title,
      description,
      responseMode,
      expiresAt,
      creator: req.user._id,
      questions: formattedQuestions,
    });

    res.status(201).json(poll);
  } catch (error) {
    res.status(500).json({ message: "Create poll failed", error: error.message });
  }
});

router.get("/my-polls", protect, async (req, res) => {
  try {
    const polls = await Poll.find({ creator: req.user._id }).sort({
      createdAt: -1,
    });

    const pollsWithCounts = await Promise.all(
      polls.map(async (poll) => {
        const responseCount = await Response.countDocuments({ poll: poll._id });

        return {
          ...poll.toObject(),
          responseCount,
          isExpired: new Date(poll.expiresAt) < new Date(),
        };
      })
    );

    res.json(pollsWithCounts);
  } catch (error) {
    res.status(500).json({ message: "Fetch polls failed", error: error.message });
  }
});

router.get("/public/:pollId", async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.pollId);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    res.json({
      ...poll.toObject(),
      isExpired: new Date(poll.expiresAt) < new Date(),
    });
  } catch (error) {
    res.status(500).json({ message: "Fetch poll failed", error: error.message });
  }
});

router.patch("/:pollId/publish", protect, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.pollId);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    if (poll.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only creator can publish results" });
    }

    poll.isPublished = true;
    await poll.save();

    res.json({ message: "Results published successfully", poll });
  } catch (error) {
    res.status(500).json({ message: "Publish failed", error: error.message });
  }
});

router.delete("/:pollId", protect, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.pollId);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    if (poll.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only creator can delete poll" });
    }

    await Response.deleteMany({ poll: poll._id });
    await poll.deleteOne();

    res.json({ message: "Poll deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
});

module.exports = router;
export const mockPolls = [
  {
    id: "poll123",
    title: "Student Feedback Poll",
    description: "Please answer the questions below.",
    responseMode: "anonymous",
    expiresAt: "2026-06-15T14:00",
    isPublished: false,
    questions: [
      {
        id: "q1",
        questionText: "How was the session?",
        isMandatory: true,
        options: ["Excellent", "Good", "Average", "Poor"],
      },
      {
        id: "q2",
        questionText: "Would you recommend this session?",
        isMandatory: false,
        options: ["Yes", "No"],
      },
    ],
    responses: [],
  },
];
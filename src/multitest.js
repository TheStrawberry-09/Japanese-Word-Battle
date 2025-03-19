import React from "react";
import Quiz from "react-quiz-component";

export const firstQuiz = {
  quizTitle: "Choose the correct answer.",
  questions: [
    {
      questionType: "text",
      question: "あ",
      answers: ["a", "i", "u", "e"],
      correctAnswer: "1",
    },
    {
      question: "い",
      questionType: "text",
      answers: ["a", "i", "u", "e"],
      correctAnswer: "2",
    },
    {
      question: "う",
      questionType: "text",
      answers: ["i", "u", "e", "o"],
      correctAnswer: "2",
      point: "0",
    },
    {
      question: "え",
      answers: ["a", "o", "e", "u"],
      correctAnswer: "4",
      questionType: "text",
      point: "0",
    },
    {
      question: "お",
      answers: ["a", "u", "e", "o"],
      correctAnswer: "4",
      questionType: "text",
      point: "0",
    },
    {
      point: "0",
      question: "⬜き (eki)",
      answers: ["え", "う", "お", "あ"],
      correctAnswer: "1",
      questionType: "text",
    },
    {
      question: "いりぐち",
      questionType: "text",
      answers: ["uriguchi", "ariguchi", "iriguchi", "origuchi"],
      correctAnswer: "3",
    },
  ],
};

export default function Multi() {
  return <Quiz quiz={firstQuiz} shuffleAnswer={true} />;
}

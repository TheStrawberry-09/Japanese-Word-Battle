import React, { useEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import getQuiz from "./getQuiz";

function CorrectWordChoice() {
  const [showFinalResults, setFinalResults] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [combo, setCombo] = useState(1);
  const [correctAns, setCorrectAns] = useState(0);
  const [showScore, setShowScore] = useState(0);
  const [questions, setQuestions] = useState([
    {
      text: "えき",
      story: "where is the train station?",
      meaning: "train station",
      options: [
        { id: 0, text: "eki", isCorrect: true },
        { id: 1, text: "aki", isCorrect: false },
        { id: 2, text: "ei", isCorrect: false },
        { id: 3, text: "ou", isCorrect: false },
      ],
    },
  ]);

  useEffect(() => {
    console.log(score);
    setShowScore(score);
  }, [score]);

  const optionClicked = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 10 * combo);
      setCombo(combo + 1);
      setCorrectAns(correctAns + 1);
    } else {
      setCombo(1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setFinalResults(true);
    }
  };
  const restartGame = () => {
    setFinalResults(false);
    setScore(0);
    setCurrentQuestion(0);
    setCombo(0);
    setCorrectAns(0);
  };
  const shuffleArray = (array) => {
    return array
      .map((item) => ({ ...item, sort: Math.random() })) // Add random sort key
      .sort((a, b) => a.sort - b.sort) // Sort based on the random key
      .map(({ sort, ...item }) => item); // Remove the sort key
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getQuiz(setQuestions, "correct_Word");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="" style={{ width: "25rem" }}>
      <h1>Choose the correct answer.</h1>
      <h2>Score : {showScore}</h2>
      <h2>Life : </h2>

      {showFinalResults ? (
        <div className="final-results">
          <h1>End</h1>
          <h2>
            {correctAns}/{questions.length} (
            {(correctAns / questions.length) * 100}%)
          </h2>
          <button className="btn btn-primary" onClick={() => restartGame()}>
            Restart
          </button>
        </div>
      ) : (
        <div className="question-card">
          <h2>
            Question {currentQuestion + 1}/{questions.length}
          </h2>
          <h3 className="question-text">{questions[currentQuestion].story}</h3>
          <h3 className="question-text">{questions[currentQuestion].text}</h3>
          <h3 className="question-text">
            {questions[currentQuestion].meaning}
          </h3>
          <ListGroup as="ul">
            {questions[currentQuestion].options.map((option) => {
              return (
                <ListGroup.Item
                  as="li"
                  className="btn"
                  variant="primary"
                  onClick={() => optionClicked(option.isCorrect)}
                  key={option.id}
                >
                  {option.text}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </div>
      )}
    </div>
  );
}

export default CorrectWordChoice;

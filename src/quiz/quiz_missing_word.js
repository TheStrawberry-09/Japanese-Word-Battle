import React, { useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import "../css/quiz.css";

function Quiz_missing_word({
  modiflyQuiz = [
    {
        text: "⬜き (eki)",
        story: "where is the train station?",
        meaning: "train station",
        options: [
          { id: 0, text: "eki", isCorrect: true },
          { id: 1, text: "aki", isCorrect: false },
          { id: 2, text: "ei", isCorrect: false },
          { id: 3, text: "ou", isCorrect: false },
        ],
      },
  ],
  setScore,
  setCombo,
  setLife,
  life,
  setCurrentQuestion,
  currentQuestion,
  combo,
  thisact,
  nextact
}) {
  const [PcurrentQuestion, setPCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null); // Track selected option
  const [showBar, setshowBar] = useState(false);
  const [showGreenBar, setshowGreenBar] = useState(false);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    const audio = new Audio(option.audio);
    audio.play();
  };

  const handleConfirm = () => {
    if (selectedOption !== null) {
      const isCorrect = selectedOption.isCorrect;
      setshowBar(true);
      setCurrentQuestion(currentQuestion + 1);
      if (isCorrect) {
        console.log("Correct!");
        setScore((prevScore) => prevScore + 10 * combo);
        setCombo((prevCombo) => prevCombo + 1);
        setshowGreenBar(true);
      } else {
        setLife(life-1)
        console.log("Incorrect!");
        setCombo(1);
      }
    } else {
      console.log("Please select an option before confirming.");
    }
  };

  const handlenext = () => {
    setshowBar(false);
    setshowGreenBar(false);
    if (PcurrentQuestion < modiflyQuiz.length - 1) {
      setPCurrentQuestion(PcurrentQuestion + 1);
      setSelectedOption(null); 
    } else {
      thisact(false);
      nextact(true);
    }
  };

  return (
    <div>
      {showBar && <div className="white-box"></div>}
      
      <div className="question_block">
        <p className="">{modiflyQuiz[PcurrentQuestion].meaning}</p>
        <h3 className="question-text">{modiflyQuiz[PcurrentQuestion].text}</h3>
      </div>
      <p>{modiflyQuiz[PcurrentQuestion].story}</p>
      <div className="">
        <div className="question-card">
          <ListGroup as="ul">
            {modiflyQuiz[PcurrentQuestion].options.map((option) => {
              return (
                <ListGroup.Item
                  as="li"
                  className={`btn ${selectedOption?.id === option.id ? "selected" : ""}`} // Add "selected" class for visual feedback
                  variant="primary"
                  onClick={() => handleOptionClick(option)}
                  key={option.id}
                >
                  {option.text}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </div>
      </div>
      <div className="confirm_block">
        <button className="confirm_button" onClick={handleConfirm} disabled={!selectedOption}>
          Confirm
        </button>
      </div>
      {showBar && (
        <div className="green-con">
          {showGreenBar ? (
            <div className="green-bar"></div>
          ) : (
            <div className="red-bar"></div>
          )}
          {showGreenBar ? (
            <div>
              <div>Correct: the answer is {modiflyQuiz[PcurrentQuestion].answer}</div>
              <button className="green-button" onClick={handlenext}>
                Next
              </button>
            </div>
          ) : (
            <div>
              <div>Incorrect: the answer is {modiflyQuiz[PcurrentQuestion].answer}</div>
              <button className="red-button" onClick={handlenext}>
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Quiz_missing_word;
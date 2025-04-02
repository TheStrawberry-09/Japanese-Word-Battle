import React, { useEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import PlaySound from "../../../component/PlaySound";
import randomArray from "../randomquiz";
import setlife from "../../../api/setLife";

function Pronunciation({
  this_stage,
  next_stage,
  game_data,
  life_act,
  setlife_act,
  userdefine,
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showBar, setshowBar] = useState(false);
  const [showGreenBar, setshowGreenBar] = useState(false);
  const [shuffleGame_data, setshuffleGame_data] = useState([
    {
      id: 1,
      isCorrect: false,
      text: "i",
    },
  ]);

  var audio = document.getElementById("player");
  if (audio) {
    audio.volume = 0.7;
  }
  const handleOptionClick = (option) => {
    PlaySound("button");
    setSelectedOption(option);
    const audio = new Audio(option.audio);
    audio.volume = 0.7;
    audio.play();
  };
  const handleClickAudio = () => {
    const audio = new Audio(game_data.audio);
    audio.volume = 0.7;
    audio.play(); //เล่นเสียง
  };
  useEffect(() => {
    randomArray(game_data.options, setshuffleGame_data);
  }, [game_data]);
  const handleConfirm = () => {
    const incorAniHead = document.getElementById("clock-text-head-id");
    const incorAniTime = document.getElementById("clock-text-time-id");
    PlaySound("button");
    if (selectedOption !== null) {
      const isCorrect = selectedOption.isCorrect;
      setshowBar(true);
      if (isCorrect) {
        PlaySound("correct");
        setshowGreenBar(true);
      } else {
        PlaySound("incorrect");
        incorAniHead.style.color = "red";
        incorAniTime.style.color = "red";
        setTimeout(() => {
          incorAniHead.style.color = "white";
          incorAniTime.style.color = "white";
        }, 500);
        setlife(life_act - 1, userdefine.uid);
        setlife_act(life_act - 1);
        if (life_act - 1 <= 0) {
          setshowBar(false);
        }
      }
    } else {
      console.log("Please select an option before confirming.");
    }
  };
  const handleClick = () => {
    PlaySound("button");
    this_stage(false);
    next_stage(true);
    setshowGreenBar(false);
    setshowBar(false);
    setSelectedOption(null);
  };
  const handleClickIncorrect = () => {
    PlaySound("button");
    setshowBar(false);
    setSelectedOption(null);
  };

  return (
    <div className="center-quiz-block">
      <div className="center-quiz-pt1">
        <h3 className="quiz-head-text">Choose the correct pronunciation.</h3>
        <iframe
          src="https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/audio%2FSound%20Effect%2F250-milliseconds-of-silence.mp3?alt=media&token=0e9184ac-c977-46e3-b009-36349f905090"
          allow="autoplay"
          id="audio"
          title="silence"
          style={{ display: "none" }}
        ></iframe>
        <audio id="player" autoPlay>
          <source src={game_data.audio} type="audio/mp3" />
        </audio>
      </div>
      <div className="question-contain">
        <div className="center-quiz-pt2">
          <div className="question_block_voice" onClick={handleClickAudio}>
            <h3 className="question-text">{game_data.text}</h3>
          </div>
        </div>
        <div className="center-quiz-pt3">
          <div className="question-card">
            <ListGroup as="ul">
              {shuffleGame_data.map((option) => {
                return (
                  <ListGroup.Item
                    as="li"
                    className={`btn ${
                      selectedOption?.id === option.id ? "selected" : ""
                    }`}
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
          <div className="confirm_block quiz-confirm-block">
            <button
              className="confirm_button"
              onClick={handleConfirm}
              disabled={!selectedOption}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
      {showBar && (
        <div className="practice-result">
          {showGreenBar ? (
            <div className="green-box">
              <div className="box-inner">
                <div className="green-text">
                  Correct: The answer is {game_data.answer}.
                </div>
                <button className="green-button" onClick={handleClick}>
                  Next
                </button>
              </div>
            </div>
          ) : (
            <div className="red-box">
              <div className="box-inner">
                <div className="red-text">
                  Incorrect: Please choose the answer again.
                </div>
                <button className="red-button" onClick={handleClickIncorrect}>
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default Pronunciation;

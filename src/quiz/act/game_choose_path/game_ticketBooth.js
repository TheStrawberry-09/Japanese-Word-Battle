import React, { useEffect, useState } from "react";
import PlaySound from "../../../component/PlaySound";
import randomArray from "../randomquiz";
import setlife from "../../../api/setLife";
function AnswerButton({ text, onClick }) {
  return (
    <button onClick={onClick} className="ticket-button">
      {text}
    </button>
  );
}

function Game_ticketBooth({
  game_data,
  setload_act,
  life_act,
  setlife_act,
  userdefine,
}) {
  const [showBar, setshowBar] = useState(false);
  const [showGreenBar, setshowGreenBar] = useState(false);
  const [shuffleGame_data, setshuffleGame_data] = useState([
    {
      id: 1,
      isCorrect: false,
      text: "i",
    },
  ]);
  useEffect(() => {
    randomArray(game_data.options, setshuffleGame_data);
  }, [game_data]);
  const handleClick = (answer) => {
    PlaySound("button");
    setshowBar(true);
    if (answer.isCorrect) {
      //ทำเมื่อตอบถูกให้มี popup ขอความเขียวขึ้นมาเพื่อกดไปหน้าถัดไป
      PlaySound("correct");
      setshowGreenBar(true);
    } else {
      PlaySound("incorrect");
      setlife(life_act - 1, userdefine.uid);
      setlife_act(life_act - 1);
      if (life_act - 1 <= 0) {
        setshowBar(false);
      }
    }
  };
  const handleClickNext = () => {
    PlaySound("button");
    setload_act(true);
  };
  const handleClickIncorrect = () => {
    PlaySound("button");
    setshowBar(false);
  };

  return (
    <div>
      <div className="choice-background-image-box">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/img%2Fgame_assets%2Fgame_path_2.png?alt=media&token=8417b8c0-0a14-460f-8c64-82a5b43fea83"
          alt="Ticket-Background-Image"
          className="choice-background-image ticket-bg-image"
        />
      </div>
      <div className="choice-box">
        <div className="ticket-box">
          {shuffleGame_data.map((choose) => (
            <AnswerButton
              key={choose.id}
              text={choose.text}
              onClick={() => handleClick(choose)}
            />
          ))}
        </div>
      </div>
      <div className="ticket-question">
        <p className="ticket-question-arrow">🢦</p>
        <h3 className="ticket-question-text">
          Choose the correct button "{game_data.wantToGo}".
        </h3>
      </div>
      {showBar && (
        <div className="green-con">
          {showGreenBar ? (
            <div className="green-box">
              <div className="box-inner">
                <div className="green-text">
                  Correct: You chose the right button.
                </div>
                <button className="green-button" onClick={handleClickNext}>
                  Next
                </button>
              </div>
            </div>
          ) : (
            <div className="red-box">
              <div className="box-inner">
                <div className="red-text">
                  Incorrect: Please choose the button again.
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

export default Game_ticketBooth;

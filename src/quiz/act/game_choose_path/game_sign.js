import React, { useEffect, useState } from "react";
import PlaySound from "../../../component/PlaySound";
import randomArray from "../randomquiz";
import setlife from "../../../api/setLife";
function AnswerButton({
  text,
  onClick,
  index,
  buttonImageList,
  buttonImageHoverList,
}) {
  const signBGImages = buttonImageList;
  const signHoverBGImages = buttonImageHoverList;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      className="sign-button"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundImage: `url(${
          isHovered
            ? signHoverBGImages[index % signHoverBGImages.length]
            : signBGImages[index % signBGImages.length]
        })`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {text}
    </button>
  );
}

function Game_sign({
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
  const imageButtons = [];
  for (let i = 0; i < shuffleGame_data.length; i++) {
    imageButtons.push(shuffleGame_data[i].image_button);
  }
  const imageButtons_hover = [];
  for (let i = 0; i < shuffleGame_data.length; i++) {
    imageButtons_hover.push(shuffleGame_data[i].image_button_hover);
  }

  const handleClick = (answer) => {
    const incorAniHead = document.getElementById("clock-text-head-id");
    const incorAniTime = document.getElementById("clock-text-time-id");
    PlaySound("button");
    setshowBar(true);
    if (answer.isCorrect) {
      //ทำเมื่อตอบถูกให้มี popup ขอความเขียวขึ้นมาเพื่อกดไปหน้าถัดไป
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
          src="https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/img%2Fgame_assets%2Fgame_path_1.png?alt=media&token=a8bf25ff-c004-4bd0-ad01-d92b0d37f595"
          alt="Sign-Background-Image"
          className="choice-background-image sign-bg-image"
        />
      </div>
      <div className="choice-box">
        <div className="sign-box">
          {shuffleGame_data.map((choose, index) => (
            <AnswerButton
              key={choose.id}
              text={choose.text}
              onClick={() => handleClick(choose)}
              buttonImageList={imageButtons}
              buttonImageHoverList={imageButtons_hover}
              index={index}
            />
          ))}
        </div>
      </div>
      <div className="sign-question">
        <p className="sign-question-arrow">🢦</p>
        <h3 className="sign-question-text">
          Choose the correct way to "{game_data.wantToGo}".
        </h3>
      </div>
      {showBar && (
        <div className="green-con">
          {showGreenBar ? (
            <div className="green-box">
              <div className="box-inner">
                <div className="green-text">
                  Correct: You chose the right path.
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
                  Incorrect: Please choose the path again.
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

export default Game_sign;

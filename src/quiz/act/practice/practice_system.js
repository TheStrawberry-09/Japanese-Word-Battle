import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import NumberFlow from "@number-flow/react";
import ActSystem from "../act_system";
import Pronunciation from "./pronunciation";
import Spelling from "./spelling";
import Word from "./word";
import PoppuMenu from "../popup_menu";
import PopupGameover from "../popup_gameover";
import getlife from "../../../api/getLife";

function Practice() {
  const [load_act, setload_act] = useState(false);
  const [gameover_act, setgameover_act] = useState(false);
  const [life_act, setlife_act] = useState(5);
  const location = useLocation();
  const { quizData } = location.state; // รับค่า quizData จาก state
  const { act_count } = location.state;
  const { userdefine } = location.state;
  const { max_count } = location.state;
  //const { life } = location.state;
  const practice_list = quizData[act_count].practice;
  const practice_type = quizData[act_count].practice.practice_type; //อิงตาม data ที่ได้มา
  //const navigate = useNavigate();
  const location_point = [];
  const storyImage = practice_list.story_image;
  useEffect(() => {
    getlife(setlife_act, userdefine.uid);
  }, [userdefine]);
  useEffect(() => {
    if (life_act <= 0) {
      setgameover_act(true);
    }
  }, [life_act]);
  for (let i = 0; i < max_count + 1; i++) {
    location_point.push(
      <div
        key={i}
        className="ipad-circle"
        style={{ top: `${(i * 100) / max_count}%` }}
      >
        {i < act_count[4] ? (
          <div
            className="ipad-inner-circle"
            style={{ backgroundColor: "#68E758" }}
          ></div>
        ) : (
          <div
            className="ipad-inner-circle"
            style={{ backgroundColor: "#9D9D9D" }}
          ></div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="choice-background-image-box">
        <img
          src={storyImage}
          alt="Sign-Background-Image"
          className="choice-background-image sign-bg-image"
        />
      </div>
      <div className="time-box">
        <div className="clock-frame">
          <div className="clock-text">
            <h4 className="clock-text-head" id="clock-text-head-id">
              Time Left
            </h4>
            <h1 className="clock-text-time" id="clock-text-time-id">
              0<NumberFlow value={life_act} />
              :00
            </h1>
          </div>
        </div>
      </div>
      <PoppuMenu
        modiflyQuiz={quizData}
        act_count={act_count}
        userdefine={userdefine}
        life={life_act}
      />
      {load_act ? (
        <ActSystem
          Isgame={true}
          modiflyQuiz={quizData}
          act_count={act_count}
          act_reward={act_count}
          userdefine={userdefine}
          life={life_act}
        />
      ) : gameover_act ? (
        <PopupGameover
          modiflyQuiz={quizData}
          act_count={act_count}
          act_reward={act_count}
          userdefine={userdefine}
          life={life_act}
        />
      ) : (
        <div></div>
      )}
      {practice_type === "pronunciation_set" ? (
        <PronunciationSet
          game_data={practice_list}
          setload_act={setload_act}
          life_act={life_act}
          setlife_act={setlife_act}
          userdefine={userdefine}
          storyImage={storyImage}
        />
      ) : practice_type === "wording_set" ? (
        <Wording
          game_data={practice_list}
          setload_act={setload_act}
          life_act={life_act}
          setlife_act={setlife_act}
          userdefine={userdefine}
          storyImage={storyImage}
        />
      ) : practice_type === "spelling_set" ? (
        <SpellingSet
          game_data={practice_list}
          setload_act={setload_act}
          life_act={life_act}
          setlife_act={setlife_act}
          userdefine={userdefine}
          storyImage={storyImage}
        />
      ) : (
        <div></div>
      )}

      <div className="act-box">
        <div className="ipad-border">
          <div className="ipad-screen">
            <div className="ipad-display">
              {location_point}
              <div
                className="ipad-display-progression"
                style={{
                  height: `${((act_count[4] - 1) * 100) / max_count}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PronunciationSet({
  game_data,
  setload_act,
  setlife_act,
  life_act,
  userdefine,
  storyImage,
}) {
  const [practice_1, setpractice_1] = useState(true);
  const [practice_2, setpractice_2] = useState(false);
  const [practice_3, setpractice_3] = useState(false);
  return (
    <div>
      {practice_1 ? (
        <Pronunciation
          this_stage={setpractice_1}
          next_stage={setpractice_2}
          game_data={game_data.pronunciation[0]}
          life_act={life_act}
          setlife_act={setlife_act}
          userdefine={userdefine}
          storyImage={storyImage}
        />
      ) : practice_2 ? (
        <Word
          this_stage={setpractice_2}
          next_stage={setpractice_3}
          game_data={game_data.word[0]}
          life_act={life_act}
          setlife_act={setlife_act}
          userdefine={userdefine}
          storyImage={storyImage}
        />
      ) : practice_3 ? (
        <Word
          this_stage={setpractice_3}
          next_stage={setload_act}
          game_data={game_data.word[1]}
          life_act={life_act}
          setlife_act={setlife_act}
          userdefine={userdefine}
          storyImage={storyImage}
        />
      ) : (
        <div></div>
      )}
    </div>
  );
}
function SpellingSet({
  game_data,
  setload_act,
  setlife_act,
  life_act,
  userdefine,
  storyImage,
}) {
  const [practice_1, setpractice_1] = useState(true);
  const [practice_2, setpractice_2] = useState(false);
  const [practice_3, setpractice_3] = useState(false);
  return (
    <div>
      {practice_1 ? (
        <Pronunciation
          this_stage={setpractice_1}
          next_stage={setpractice_2}
          game_data={game_data.pronunciation[0]}
          life_act={life_act}
          setlife_act={setlife_act}
          userdefine={userdefine}
          storyImage={storyImage}
        />
      ) : practice_2 ? (
        <Spelling
          this_stage={setpractice_2}
          next_stage={setpractice_3}
          game_data={game_data.spelling[0]}
          life_act={life_act}
          setlife_act={setlife_act}
          userdefine={userdefine}
          storyImage={storyImage}
        />
      ) : practice_3 ? (
        <Spelling
          this_stage={setpractice_3}
          next_stage={setload_act}
          game_data={game_data.spelling[1]}
          life_act={life_act}
          setlife_act={setlife_act}
          userdefine={userdefine}
          storyImage={storyImage}
        />
      ) : (
        <div></div>
      )}
    </div>
  );
}
function Wording({
  game_data,
  setload_act,
  setlife_act,
  life_act,
  userdefine,
  storyImage,
}) {
  const [practice_1, setpractice_1] = useState(true);
  const [practice_2, setpractice_2] = useState(false);
  const [practice_3, setpractice_3] = useState(false);
  return (
    <div>
      {practice_1 ? (
        <Word
          this_stage={setpractice_1}
          next_stage={setpractice_2}
          game_data={game_data.word[0]}
          life_act={life_act}
          setlife_act={setlife_act}
          userdefine={userdefine}
          storyImage={storyImage}
        />
      ) : practice_2 ? (
        <Word
          this_stage={setpractice_2}
          next_stage={setpractice_3}
          game_data={game_data.word[1]}
          life_act={life_act}
          setlife_act={setlife_act}
          userdefine={userdefine}
          storyImage={storyImage}
        />
      ) : practice_3 ? (
        <Spelling
          this_stage={setpractice_3}
          next_stage={setload_act}
          game_data={game_data.spelling[0]}
          life_act={life_act}
          setlife_act={setlife_act}
          userdefine={userdefine}
          storyImage={storyImage}
        />
      ) : (
        <div></div>
      )}
    </div>
  );
}
export default Practice;

import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Story from "./story";
import StoryPerPratice from "./story_per_practice";
import ActSystem from "../act_system";
import PoppuMenu from "../popup_menu";
import PlaySound from "../../../component/PlaySound";

function StorySystem() {
  const [number_story, setnumber_story] = useState(1);
  //const [targetText, settargetText] = useState("story_text_1");
  const [per_pratice_act, setper_pratice_act] = useState(false);
  const [next_act, setreward_act] = useState(false);
  const [load_act, setload_act] = useState(false);
  const [story_act, setstory_act] = useState(true);
  const [life_act, setlife_act] = useState(0);
  const [nextAct, setNextAct] = useState(false);
  const [targetImg, settargetImg] = useState("story_image_1");
  const location = useLocation();
  const { quizData } = location.state; // รับค่า quizData จาก state
  const { poststory } = location.state; // รับค่า quizData จาก state
  const { act_count } = location.state;
  const { userdefine } = location.state;
  //const { max_count } = location.state;
  const { life } = location.state;
  const story_text = quizData[act_count].story; // จัดการ act ด้วย
  const { max_count } = location.state;
  const storyImage = story_text.story_image;
  const location_point = [];
  useEffect(() => {
    setlife_act(life);
  }, [life]);
  useEffect(() => {
    if (number_story !== undefined) {
      settargetImg("story_image_" + number_story);
    }
  }, [number_story]);
  useEffect(() => {
    if (nextAct) {
      PlaySound("button");
      if (poststory & (number_story + 1 > 1)) {
        setreward_act(true);
      }
      if (number_story + 1 <= story_text.story_count) {
        setnumber_story(number_story + 1);
        /*settargetText("story_text_" + (number_story + 1));
        console.log(number_story);*/
      }
      if (number_story + 1 > story_text.story_count) {
        setstory_act(false);
        setper_pratice_act(true);
        setnumber_story(1);
      }
      if (
        (number_story + 1 >
          quizData[act_count].choose_path.per_practice.story_count) &
        per_pratice_act
      ) {
        setper_pratice_act(false);
        setload_act(true);
      }
      setNextAct(false);
    }
  }, [
    nextAct,
    act_count,
    number_story,
    per_pratice_act,
    poststory,
    quizData,
    story_text,
  ]);
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
          src={storyImage[targetImg]}
          alt="Sign-Background-Image"
          className="choice-background-image sign-bg-image blur-image"
        />
      </div>
      <div className="time-box">
        <div className="clock-frame">
          <div className="clock-text">
            <h4 className="clock-text-head">Time Left</h4>
            <h1 className="clock-text-time">0{life_act}:00</h1>
          </div>
        </div>
      </div>
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
      <PoppuMenu
        modiflyQuiz={quizData}
        act_count={act_count}
        act_rewar={act_count}
        userdefine={userdefine}
        life={life_act}
      />
      {load_act ? (
        <ActSystem
          Ispractice={true}
          modiflyQuiz={quizData}
          act_count={act_count}
          act_reward={act_count}
          userdefine={userdefine}
          life={life_act}
        />
      ) : next_act ? (
        <ActSystem
          Isnext={true}
          modiflyQuiz={quizData}
          act_count={act_count}
          act_rewar={act_count}
          userdefine={userdefine}
          life={life_act}
        />
      ) : (
        <div></div>
      )}
      <div className="story-main-container">
        {/* <div></div>
        <div>time point left : {life_act}</div>
        <div>
          act count : {act_count[4]}/{max_count}
        </div> */}

        {poststory ? (
          <div></div>
        ) : story_act ? (
          <Story scene_number={number_story} setNextAct={setNextAct} />
        ) : per_pratice_act ? (
          <StoryPerPratice
            scene_number={number_story}
            setNextAct={setNextAct}
          />
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default StorySystem;

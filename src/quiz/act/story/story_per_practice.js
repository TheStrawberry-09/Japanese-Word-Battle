import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "../../../css/quiz.css";
import TextFadeIn from "./TextFadeIn";
function Story_per_practice({ scene_number, setNextAct }) {
  const [targetText, settargetText] = useState("story_text_1");
  const [targetImg, settargetImg] = useState("story_image_1");
  const location = useLocation();
  const { quizData } = location.state; // รับค่า quizData จาก state
  const { act_count } = location.state;
  const story = quizData[act_count].choose_path.per_practice; // จัดการ act ด้วย
  useEffect(() => {
    if (scene_number !== undefined) {
      settargetText("story_text_" + scene_number);
      settargetImg("story_image_" + scene_number);
    }
  }, [scene_number]);

  return (
    <div className="story_container">
      <div className="story_action">
        <div className="choice-background-image-box">
          <img
            src={story.story_image[targetImg]}
            alt="Sign-Background-Image"
            className="choice-background-image sign-bg-image"
          />
        </div>
      </div>
      <TextFadeIn
        text={story.story_text[targetText]}
        speed={50}
        setNextAct={setNextAct}
      />
    </div>
  );
}

export default Story_per_practice;

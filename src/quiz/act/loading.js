import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ActSystem from "./act_system";
import Walking from "./loading_scene/walking";
import Bus from "./loading_scene/bus";
import Train from "./loading_scene/train";
import "../../css/loading.css";

function Loading() {
  const [seconds, setSeconds] = useState(3);
  const [load_act, setload_act] = useState(false);
  const location = useLocation();
  const { quizData } = location.state; // รับค่า quizData จาก state
  const { act_count } = location.state;
  const { userdefine } = location.state;
  const { life } = location.state;
  const { loading_type } = location.state;

  useEffect(() => {
    let timer;
    if (seconds > 0) {
      timer = setInterval(() => {
        setSeconds(seconds - 1);
      }, 1000);
    } else {
      setload_act(true);
    }
    return () => clearInterval(timer); // ยกเลิก interval เมื่อ component ถูก unmount หรือ seconds เปลี่ยน
  }, [seconds]);
/*
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };*/

  return (
    <div>
      {/* <h2>Countdown: {formatTime(seconds)}</h2> */}
      <div>
        {load_act ? (
          <ActSystem
            Isnext={true}
            modiflyQuiz={quizData}
            act_count={act_count}
            act_reward={act_count}
            userdefine={userdefine}
            life={life}
          />
        ) : (
          <div></div>
        )}
      </div>
      <div>
        {loading_type === "walking" ? (
          <Walking />
        ) : loading_type === "bus" ? (
          <Bus />
        ) : loading_type === "train" ? (
          <Train />
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default Loading;

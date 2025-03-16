import "../css/stage.css";
import PlaySound from "../component/PlaySound";
import {useEffect, useState} from "react";

function Stage({ setIsPlayer, userData, modiflyQuiz, setStageplay }) {
  const [showStage, setShowStage] = useState(1)
  const stages = Object.keys(modiflyQuiz).map((key) => ({
    value: modiflyQuiz[key].stage_index,
    label: modiflyQuiz[key].stage_name,
    image: modiflyQuiz[key].stage_image,
  }));
  const handleTostage = (value) => {
    PlaySound("enter");
    setStageplay(value);
    setIsPlayer(true);
  };
  const getStageNumber = (str) => {
    return str.split("_")[1]; // หรือใช้วิธีอื่น ๆ ที่กล่าวมาข้างต้น
  };
  useEffect(()=>{
    //ตรวจว่า obj ไม่ใส่ obj เปล่า
    if(Object.keys(userData).length !== 0){
      if(userData.Stamp_Data === ""){
        setShowStage(1)
      }
      else{
        setShowStage(Object.keys(userData.Stamp_Data).length+1)
      }
    }
  },[userData])

  return (
    <div className="stage-display">
      {stages.map((stage) => (
        <div
          key={stage.value}
          className={`stage ${getStageNumber(stage.value) > showStage ? "stage-locked" : ""}`}
          value={stage.value}
          onClick={() => {
            if (getStageNumber(stage.value) > showStage) {
              return; // ไม่ให้ทำงานเมื่อ stage ถูกล็อค
            }
            handleTostage(stage.value);
          }}
          style={{
            backgroundImage: `url(${stage.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {stage.label}
        </div>
      ))}
    </div>
  );
}

export default Stage;

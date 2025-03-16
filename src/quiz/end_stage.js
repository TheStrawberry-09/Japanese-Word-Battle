import React, { useEffect, useState } from "react";
import "../css/quiz.css";
import { app } from "../firebase"; // Import your Firebase configuration
import { getDatabase, ref, update, onValue } from "firebase/database";

function End_stage({
  modiflyQuiz,
  thisact,
  nextact,
  Score,
  userdefine,
}) {
  const [user_score, setuser_score] = useState(false);
  const [user_stage, setuser_stage] = useState(false);
  const [userBankword, setuserBankword] = useState(false);
  useEffect(() => {
    const term = userdefine.uid;
    const databaseRef = ref(getDatabase(app), `User_Data/` + term);
    onValue(databaseRef, async (snapshot) => {
      const data = snapshot.val();
      setuser_score(data.user_score);
      console.log(modiflyQuiz.User_stage)
      console.log(data.user_stage)
      if(modiflyQuiz.User_stage > data.user_stage){
        setuser_stage(modiflyQuiz.User_stage);
      }
      else{
        setuser_stage( data.user_stage);
      }
      //setuserBankword(data.userBankword);
      //setuserBankword(["えき"]);
    });
  },[]);
  const handlenext = () => {
    const db = getDatabase(app);
    const term = userdefine.uid;
    const termRef = ref(db, "User_Data/" + term);
    console.log(termRef);
//const add_word = []
    update(termRef, {
      user_score: Score + user_score,
      user_stage:user_stage,
      learning_level:modiflyQuiz.Learning_level,
   // userBankword: add_word,
    });
    console.log("tine");

    thisact(false);
    nextact(false);
  };
  return (
    <div>
      <div className="story_container">
        <div className="story_action">
            <img className="image_reward" src={modiflyQuiz.Image_reward} alt="image_reward"/>
        </div>
        <div className="confirm_block">
          <button
            className="confirm_button"
            onClick={handlenext}
            style={{ marginTop: "1vh" }}
          >
            End Tip
          </button>
        </div>
      </div>
    </div>
  );
}

export default End_stage;

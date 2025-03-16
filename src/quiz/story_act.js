import React, { useEffect, useState } from "react";
import "../css/quiz.css";

function StoryAct({ modiflyQuiz, thisact, nextact }) {
  const handlenext = () => {
    thisact(false);
    nextact(true);
  };
  return (
    <div>
      <div className="story_container">
        <div className="story_action">Story Action</div>
        <div className="story_text">{modiflyQuiz}</div>
        <div className="confirm_block">
          <button
            className="confirm_button"
            onClick={handlenext}
            style={{ marginTop: "1vh" }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default StoryAct;

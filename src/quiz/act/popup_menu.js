import React, { useState } from "react";
import "../../css/stage.css";
import ActSystem from "./act_system";
import PlaySound from "../../component/PlaySound";

function Poppu_menu({ modiflyQuiz, act_count, userdefine, life }) {
  const [load_act, setload_act] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    PlaySound("button");
    setShowPopup(!showPopup);
  };
  const toggleQuit = () => {
    PlaySound("button");
    setload_act(true);
  };

  return (
    <div className="popupMenu">
      <button onClick={togglePopup} className="menu-popup-button">
        Menu
      </button>
      {showPopup && (
        <>
          <div className="popup-box"></div>
          <div className="popup">
            <div className="popup-content">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/img%2Fgame_assets%2Fpopup_pause.png?alt=media&token=9f31b9b5-1117-4b60-b337-2cb9c5dcc421"
                alt="Menu-Image"
                className="menu-image"
              />
              <button onClick={togglePopup} className="confirm-button">
                <h5 className="profile-popup-sub-text">Continue</h5>
              </button>
              <button onClick={toggleQuit} className="cancel-button">
                <h5 className="profile-popup-sub-text">Quit</h5>
              </button>
            </div>
          </div>
        </>
      )}
      {load_act ? (
        <ActSystem
          IsQuit={true}
          Isnext={false}
          modiflyQuiz={modiflyQuiz}
          act_count={act_count}
          act_reward={act_count}
          userdefine={userdefine}
          life={life}
        />
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Poppu_menu;

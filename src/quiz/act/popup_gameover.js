import React, { useEffect, useState } from "react";
import "../../css/stage.css";
import ActSystem from "./act_system";
import PlaySound from "../../component/PlaySound";
import SetLife from "../../api/setLife";
function Poppu_Gameover({ modiflyQuiz, act_count, userdefine, life }) {
  const [load_act, setload_act] = useState(false);
  const [restart_act, setrestart_act] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const togglePopup = () => {
    PlaySound("button");
    SetLife(5, userdefine.uid);
    setShowPopup(!showPopup);
    setrestart_act(true);
  };
  const toggleQuit = () => {
    PlaySound("button");
    setload_act(true);
  };

  useEffect(() => {
    PlaySound("stagefail");
  }, []);

  return (
    <div className="popupMenu">
      {showPopup && (
        <>
          <div className="popup-box"></div>
          <div className="popup">
            <div className="popup-content">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/img%2Fgame_assets%2Fpopup_game%20over.png?alt=media&token=8e7c1954-e300-45cc-8dd7-f321f029d2fa"
                alt="Menu-Image"
                className="menu-image"
              />
              <button onClick={togglePopup} className="confirm-button">
                <h5 className="profile-popup-sub-text">Restart</h5>
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
      ) : restart_act ? (
        <ActSystem
          Isstory={true}
          modiflyQuiz={modiflyQuiz}
          act_count={"act_1"}
          act_reward={"act_1"}
          Ispractice={false}
          userdefine={userdefine}
          life={5}
        />
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Poppu_Gameover;

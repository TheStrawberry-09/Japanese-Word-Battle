import React, { useState } from "react";
import "../../css/stage.css";
import PlaySound from "../../component/PlaySound";

function Poppu_Stamp({ stamp_image }) {
  const [showPopup, setShowPopup] = useState(true);
  const togglePopup = () => {
    PlaySound("button");
    setShowPopup(!showPopup);
  };

  return (
    <div className="popupMenu">
      {showPopup && (
        <>
          <div className="popup-box"></div>
          <div className="popup">
            <div className="popup-content">
              <h2 className="text-center">Congratulations!</h2>
              <h5 className="text-center">You got new stamp!</h5>
              <img src={stamp_image} alt="Stamp-Image" className="menu-image" />
              <button
                onClick={togglePopup}
                className="confirm-button reward-popup-confirm-button"
              >
                <h5>Continue</h5>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Poppu_Stamp;

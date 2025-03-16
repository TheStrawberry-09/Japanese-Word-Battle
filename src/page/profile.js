import React, { useState } from "react";
import "../css/profile.css";
import { app } from "../firebase"; // Import your Firebase configuration
import { getDatabase, ref, update } from "firebase/database";
import PlaySound from "../component/PlaySound";

function Proflie({ userData }) {
  const [showPopup, setShowPopup] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const calculatorStamp = (option) => {
    var stampPoint = 0;
    if (option !== undefined) {
      for (var key of Object.keys(option)) {
        if (option[key].Stamp === "normal") {
          stampPoint = stampPoint + 1;
        } else if (option[key].Stamp === "trim") {
          stampPoint = stampPoint + 1;
        }
      }
    }
    return stampPoint;
  };


  const handleClose = () => {
    PlaySound("button");
    setShowPopup(false);
  };
  const handleSearch = () => {
    PlaySound("button");

    const db = getDatabase(app);
    const term = userData.uid;
    const termRef = ref(db, "User_Data/" + term);
    console.log(termRef);
    update(termRef, {
      username: searchValue,
    });
    setShowPopup(false);
  };

  return (
    <div className="profile">
      <div className="profile_image">
        <img
          src={userData.user_profile}
          alt="Profile"
          height="100%"
          className="user-image"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="profile-data">
        <div className="username">
          <h3 className="profile-side-head-text">User Name</h3>
          <p className="profile-side-par-text">{userData.username}</p>
        </div>
        <div className="useremail">
          <h3 className="profile-side-head-text">Email</h3>
          <p className="profile-side-par-text">{userData.useremail}</p>
        </div>
        <div className="proflie_block">
          <h3 className="profile-head-text">แสตมป์ทั้งหมด</h3>
          <p className="profile-par-text">
            {calculatorStamp(userData.Stamp_Data)}
          </p>
        </div>
      </div>
      <div className="proflie_block_button">
        <button
          className="change-name-button"
          onClick={() => {
            PlaySound("button");
            setShowPopup(true);
          }}
        >
          <h5 className="change-name-button-text">CHANGE USER NAME</h5>
        </button>
      </div>
      <div>
        {showPopup && (
          <>
            <div className="popup-box"></div>
            <div className="popup">
              <div className="popup-top">
                <input
                  className="popup-text-input"
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <h4 className="profile-popup-head-text">กรองชื่อที่ต้องการ</h4>
              </div>
              <button className="confirm-button" onClick={handleSearch}>
                <h5 className="profile-popup-sub-text">ตกลง</h5>
              </button>
              <button className="cancel-button" onClick={handleClose}>
                <h5 className="profile-popup-sub-text">ยกเลิก</h5>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Proflie;

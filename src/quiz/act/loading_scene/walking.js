import React, { useEffect } from "react";

function Walking() {
  useEffect(() => {
    const walkingDiv = document.getElementById("walking-bg");
    setTimeout(() => {
      walkingDiv.style.backgroundPosition = "-500px 0";
    }, 0);
  }, []);

  return (
    <div id="walking-bg">
      <h1 className="loading-text">Walking...</h1>
      <img
        src="https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/animation%2Fwalking.gif?alt=media&token=5fc1e6ff-a5c4-495e-82c4-a6448a75c57c"
        alt="Character Walking"
        className="char-walking"
      />
    </div>
  );
}
export default Walking;

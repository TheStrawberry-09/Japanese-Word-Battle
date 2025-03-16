import React, { useState, useEffect } from "react";

const TextFadeIn = ({ text, speed, setNextAct }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const [isAccelerated, setIsAccelerated] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  useEffect(() => {
    if (index < text.length && !isAccelerated) {
      const timeout = setTimeout(() => {
        setDisplayedText((prevText) => prevText + text[index]);
        setIndex((prevIndex) => prevIndex + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (isAccelerated && index < text.length) {
      setDisplayedText(text);
      setIndex(text.length);
      setIsComplete(true);
    } else if (index === text.length) {
      setIsComplete(true);
    }
  }, [text, index, speed, isAccelerated]);

  const accelerate = () => {
    if (isComplete) {
      setNextAct(true);
      setIsAccelerated(false);
      setDisplayedText("");
      setIndex(0);
      setIsComplete(false);
    } else {
      setIsAccelerated(true);
    }
  };

  return (
    <div
      className="story_text"
      onClick={accelerate}
      style={{
        cursor: "pointer",
      }}
    >
      <p
        className="text-animation"
        style={{ opacity: 0, animation: "fadeIn 1s ease-in-out forwards" }}
      >
        {displayedText}
      </p>
      {isComplete ? (
        <p
          className="story-arrow"
          style={{ animation: "fadeIn 0s ease-in-out forwards" }}
        >
          ➪
        </p>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default TextFadeIn;

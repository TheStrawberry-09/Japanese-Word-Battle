import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import "../css/quiz.css";

function Quiz_Sentence({
  modiflyQuiz = [
    {
      text: "⬜き (eki)",
      story: "where is the train station?",
      meaning: "train station",
      options: [
        {
          id: 3,
          isCorrect: false,
          text: "お",
        },
        {
          id: 0,
          isCorrect: true,
          text: "え",
        },
        {
          id: 1,
          isCorrect: false,
          text: "あ",
        },
        {
          id: 2,
          isCorrect: false,
          text: "い",
        },
      ],
    },
  ],
  setScore,
  setCombo,
  setLife,
  life,
  setCurrentQuestion,
  currentQuestion,
  combo,
  thisact,
  nextact,
}) {
  const [PcurrentQuestion, setPCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null); // Track selected option
  const [showBar, setshowBar] = useState(false);
  const [showGreenBar, setshowGreenBar] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedText, setSelectedText] = useState("");
  const [buttonDisabledStates, setButtonDisabledStates] = useState(
    new Array(modiflyQuiz[PcurrentQuestion].options.length).fill(false)
  );
  const [confirm_button_on, setconfirm_button_on] = useState(true);

  const handleOptionClick = (option, index) => {
    if (selectedItems.length == 1) {
      setconfirm_button_on(false);
    }
    // กำหนดว่าให้เลือกกี่ตัว
    if (selectedItems.length < 2) {
      const audio = new Audio(option.audio);
      audio.play();

      const newButtonDisabledStates = [...buttonDisabledStates];
      newButtonDisabledStates[index] = true;
      setButtonDisabledStates(newButtonDisabledStates);
      if (selectedItems.includes(option.id)) {
        setSelectedItems(selectedItems.filter((id) => id !== option.id));
      } else {
        setSelectedItems([...selectedItems, option.id]);
      }
    } else {
      setconfirm_button_on(false);
      // เมื่อเลือกเกินจำนวนเกินที่กำหนด
      alert("คุณเลือกคำครบ 2 คำแล้ว");
    }
  };

  useEffect(() => {
    const newSelectedText = selectedItems
      .map((id) => {
        const selectedOption = modiflyQuiz[PcurrentQuestion].options.find(
          (opt) => opt.id === id
        );
        return selectedOption ? selectedOption.text : "";
      })
      .join(" ");

    // ใส่ "_" สำหรับคำที่ยังไม่ได้เลือก
    const createFullText = (selectedText) => {
      // กำหนดจำนวนคำสูงสุดของคำตอบ
      const totalWords = 2;
      const missingWords = totalWords - selectedText.split(" ").length;
      return newSelectedText + "_".repeat(missingWords);
    };

    setSelectedText(createFullText(newSelectedText));
  }, [selectedItems]);
  const handleWordClick = (word) => {
    const modfiword = word.replaceAll("_", "");
    // หาตำแหน่งของคำที่จะลบออกว่า เป็นคำอะไร เป็นคำที่เท่าไหร่ของปุ่ม
    const index = selectedItems.findIndex((id) => {
      const selectedOption = modiflyQuiz[PcurrentQuestion].options.find(
        (opt) => opt.id === id
      );
      return selectedOption?.text === modfiword;
    });
    const indexText = modiflyQuiz[PcurrentQuestion].options.findIndex(
      (option) => option.text === modfiword
    );
    if (index !== -1) {
      const newButtonDisabledStates = [...buttonDisabledStates];
      newButtonDisabledStates[indexText] = false;
      setButtonDisabledStates(newButtonDisabledStates);
      setSelectedItems(selectedItems.filter((_, i) => i !== index));
    } else {
      console.log("ไม่พบคำที่ต้องการลบ");
    }
  };
  const handleConfirm = () => {
    console.log(selectedText);
    const user_ans = selectedText.replaceAll(" ", "");
    setshowBar(true);
    if (user_ans === modiflyQuiz[PcurrentQuestion].answer) {
      setCurrentQuestion(currentQuestion + 1);
      setScore((prevScore) => prevScore + 10 * combo);
      setCombo((prevCombo) => prevCombo + 1);
      setshowGreenBar(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setLife(life - 1);
      console.log("Incorrect!");
      setCombo(1);
    }
  };

  const handlenext = () => {
    setshowBar(false);
    setshowGreenBar(false);
    if (PcurrentQuestion < modiflyQuiz.length - 1) {
      setPCurrentQuestion(PcurrentQuestion + 1);
      setSelectedOption(null);
    } else {
      thisact(false);
      nextact(true);
    }
  };

  return (
    <div>
      {showBar && <div className="white-box"></div>}
      <div className="question_block_sen">
        <h5 className="question-text_sen">
          {modiflyQuiz[PcurrentQuestion].text}
        </h5>
        <h1 className="text_hover">
          {selectedText.split(" ").map((word) => (
            <span
              className="sentence_ans"
              key={word}
              onClick={() => handleWordClick(word)}
            >
              {word}
            </span>
          ))}
        </h1>

        <p className="">{modiflyQuiz[PcurrentQuestion].meaning}</p>
      </div>
      <p>{modiflyQuiz[PcurrentQuestion].story}</p>
      <div className="">
        <div className="question-card">
          <ListGroup as="ul">
            {modiflyQuiz[PcurrentQuestion].options.map((option, index) => {
              return (
                <ListGroup.Item
                  as="li"
                  className={`btn ${
                    selectedOption?.id === option.id ? "selected" : ""
                  }`}
                  variant="primary"
                  onClick={() => handleOptionClick(option, index)}
                  disabled={buttonDisabledStates[index]}
                  key={option.id}
                >
                  {option.text}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </div>
      </div>
      <div className="confirm_block">
        <button
          className="confirm_button"
          onClick={handleConfirm}
          disabled={confirm_button_on}
        >
          Confirm
        </button>
      </div>
      {showBar && (
        <div className="green-con" style={{ marginTop: "6vh" }}>
          {showGreenBar ? (
            <div className="green-bar"></div>
          ) : (
            <div className="red-bar"></div>
          )}
          {showGreenBar ? (
            <div>
              <div>
                Correct: the answer is {modiflyQuiz[PcurrentQuestion].answer}
              </div>
              <button className="green-button" onClick={handlenext}>
                Next
              </button>
            </div>
          ) : (
            <div>
              <div>
                Incorrect: the answer is {modiflyQuiz[PcurrentQuestion].answer}
              </div>
              <button className="red-button" onClick={handlenext}>
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Quiz_Sentence;

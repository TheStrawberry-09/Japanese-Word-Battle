import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import "../css/quiz.css";

const Quiz_matching = ({
  modiflyQuiz,
  setScore,
  setCombo,
  setLife,
  life,
  setCurrentQuestion,
  currentQuestion,
  combo,
  thisact,
  nextact,
}) => {
  const [countselect, setCountselect] = useState(0);
  const [matchQuzArray, setMatchQuzArray] = useState([]);
  const [matchAnsArray, setMatchAnsArray] = useState([]);
  const [finish, setFinish] = useState(false);
  const [selectLeft, setSelectLeft] = useState(null);
  const [selectRight, setSelectRight] = useState(null);
  const [showBar, setshowBar] = useState(false);
  //const [showGreenBar, setshowGreenBar] = useState(false);
  function HandleSelected(item) {


    if (item.type === "word" && !item.matched) {
      setSelectLeft(item);
      const audio = new Audio(item.audio);
      audio.play();
    } else if (!item.matched) {
      setSelectRight(item);
    }
  }

  function RemoveSelection() {
    setSelectLeft(null);
    setSelectRight(null);
  }

  useEffect(() => {
    if (selectLeft && selectRight) {
      if (selectLeft.id === selectRight.id) {
        setMatchQuzArray((prevArray) => {
          return prevArray.map((unit) => {
            if (unit.id === selectLeft.id) {
              return { ...unit, matched: true };
            } else {
              return unit;
            }
          });
        });
        setMatchAnsArray((prevArray) => {
          return prevArray.map((unit) => {
            if (unit.id === selectRight.id) {
              return { ...unit, matched: true };
            } else {
              return unit;
            }
          });
        });
        setCountselect(countselect + 1);
        setScore((prevScore) => prevScore + 10 * combo);
        setCombo((prevCombo) => prevCombo + 1);
        RemoveSelection();
        console.log(countselect + 1)
        console.log(matchQuzArray.length - 1)
        if (countselect === matchQuzArray.length - 1) {
          setCurrentQuestion(currentQuestion+1)
          setshowBar(true);
          console.log("test")
        }
      } else {
        setLife(life-1)
        RemoveSelection();
      }
    }
  }, [matchQuzArray.length, countselect, selectLeft, selectRight]);



  useEffect(() => {
    setMatchQuzArray(modiflyQuiz.matchQuz);
    setMatchAnsArray(modiflyQuiz.matchAns);
    setFinish(false);
    setshowBar(false);
    setSelectLeft(null);
    setSelectRight(null);
  }, []);
  const handlenext = () => {
    thisact(false);
    nextact(true);
  };

  return (
    <div>
      {showBar && <div className="white-box"></div>}
      <div className="containers">
        <div className="header">

        </div>
        <div className="board container text-center">
          <div className="row">
            <ListGroup as="ul" className="matching-items col">
              {matchQuzArray.map((item) => (
                <ListGroup.Item
                  key={item.id}
                  onClick={() => HandleSelected(item)}
                  style={{
                    ...(selectLeft && selectLeft.id === item.id
                      ? { backgroundColor: "red" }
                      : {}),
                    ...(item.matched ? { opacity: 0.5 } : { opacity: 1 }),
                  }}
                >
                  {item.text}
                </ListGroup.Item>
              ))}
            </ListGroup>
            <ListGroup as="ul" className="matching-items col">
              {matchAnsArray.map((item) => (
                <ListGroup.Item
                  key={item.id}
                  onClick={() => HandleSelected(item)}
                  style={{
                    ...(selectRight && selectRight.id === item.id
                      ? { backgroundColor: "red" }
                      : {}),
                    ...(item.matched ? { opacity: 0.5 } : { opacity: 1 }),
                  }}
                >
                  {item.text}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </div>
      </div>
      {showBar && (
        <div className="green-con" style={{marginTop: "15vh"}}>
          <div className="green-bar"></div>
          <div></div>
          <button className="green-button" onClick={handlenext}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz_matching;

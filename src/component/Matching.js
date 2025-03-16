import React, { useEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import "./MatchingSty.css";
import getQuiz from "./getQuiz";

function Matching() {
  const [score, setScore] = useState(0);
  const [matchQuzArray, setMatchQuzArray] = useState([]);
  const [matchAnsArray, setMatchAnsArray] = useState([]);
  const [finish, setFinish] = useState(false);
  const [allMatch, setAllMatch] = useState(0);
  const [selectLeft, setSelectLeft] = useState(null);
  const [selectRight, setSelectRight] = useState(null);
  const [questions, setQuestions] = useState({
    matchQuz: [
      {
        id: 1,
        text: "えき",
        type: "word",
        matched: false,
      },
      {
        id: 2,
        text: "バス",
        type: "word",
        matched: false,
      },
    ],
    matchAns: [
      {
        id: 1,
        text: "Train",
        type: "meaning",
        matched: false,
      },
      {
        id: 2,
        text: "Bus",
        type: "meaning",
        matched: false,
      },
    ],
  });

  function NewGame() {
    questions.matchQuz = shuffleArray(questions.matchQuz);
    questions.matchAns = shuffleArray(questions.matchAns);
    setScore(0);
    setMatchQuzArray(questions.matchQuz);
    setMatchAnsArray(questions.matchAns);
    setFinish(false);
    setAllMatch(0);
    setSelectLeft(null);
    setSelectRight(null);
  }

  function HandleSelected(item) {
    if (item.type === "word" && !item.matched) {
      console.log("yes");
      setSelectLeft(item);
    } else if (!item.matched) {
      console.log("no");
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
        setScore(score + 1);
        RemoveSelection();
        if (score === matchQuzArray.length - 1) {
          setFinish(true);
        }
      } else {
        RemoveSelection();
      }
    }
  }, [matchQuzArray.length, score, selectLeft, selectRight]);

  useEffect(() => {
    NewGame();
    console.log(questions);
  }, [questions]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getQuiz(setQuestions, "matching");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  const shuffleArray = (array) => {
    return array
      .map((item) => ({ ...item, sort: Math.random() })) // Add random sort key
      .sort((a, b) => a.sort - b.sort) // Sort based on the random key
      .map(({ sort, ...item }) => item); // Remove the sort key
  };

  return (
    <div>
      {finish ? (
        <div className="container">
          <h2>You Win!</h2>
          <button className="btn btn-success" onClick={() => NewGame()}>
            Restart
          </button>
        </div>
      ) : (
        <div className="container">
          <div className="header">
            <h1>Matching the correct answer.</h1>
            <h2>{score}</h2>
          </div>
          <div className="board container text-center">
            <div className="row">
              <ListGroup as="ul" className="matching-items col">
                {matchQuzArray.map((item) => (
                  <ListGroup.Item
                    as="li"
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
                    as="li"
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
      )}
    </div>
  );
}

export default Matching;

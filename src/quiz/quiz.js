import React, { useState } from "react";
import "../css/quiz.css";
import Quiz_Pronunciation from "./quiz_Pronunciation";
import Quiz_spelling from "./quiz_spelling";
import Quiz_missing from "./quiz_missing_word";
import Quiz_matching from "./quiz_matching";
import Quiz_Sentence from "./quiz_sentence";
import Story_Act from "./story_act";
import End_Act from "./end_stage";
import { useEffect } from "react";
function Quiz({
  setIsPlayer,
  modiflyQuiz = {
    Quizcharacter: [
      {
        options: [
          {
            id: 0,
            isCorrect: true,
            text: "a",
          },
          {
            id: 2,
            isCorrect: false,
            text: "u",
          },
          {
            id: 3,
            isCorrect: false,
            text: "e",
          },
          {
            id: 1,
            isCorrect: false,
            text: "i",
          },
          {
            id: 4,
            isCorrect: false,
            text: "o",
          },
        ],
        text: "あ, ア",
      },
    ],
    Quizmatching: {
      matchAns: [
        {
          id: 3,
          matched: false,
          text: "Oshiage",
          type: "meaning",
        },
      ],
      matchQuz: [
        {
          id: 3,
          matched: false,
          text: "おしあげ",
          type: "word",
        },
      ],
    },
    Quizroadmap: [
      {
        Correct_Word: [
          {
            meaning: "train station",
            options: [
              {
                id: 0,
                isCorrect: true,
                text: "eki",
              },
              {
                id: 3,
                isCorrect: false,
                text: "ou",
              },
              {
                id: 2,
                isCorrect: false,
                text: "ei",
              },
              {
                id: 1,
                isCorrect: false,
                text: "aki",
              },
            ],
            story: "where is the train station?",
            text: "えき",
          },
        ],
        Missing_Word: [
          {
            meaning: "train station",
            options: [
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
                id: 3,
                isCorrect: false,
                text: "お",
              },
              {
                id: 2,
                isCorrect: false,
                text: "い",
              },
            ],
            story: "where is the train station?",
            text: "⬜き (eki)",
          },
        ],
        roadMapType: "train",
      },
    ],
  },
  userdefine,
}) {
  const [Score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [combo, setCombo] = useState(1);
  const [life, setLife] = useState(99);

  const [storyAct, setStoryAct] = useState(true);
  const [storyAct_end, setStoryAct_end] = useState(false);
  const [pronunciationAct, setpronunciationAct] = useState(false);
  const [missingWordAct, setMissingWordAct] = useState(false);
  const [matchingAct, setMatchingAct] = useState(false);
  const [spellingAct, setSpellingAct] = useState(false);
  const [SentenceAct, setSentenceAct] = useState(false);
  const [rewardAct, setRewardAct] = useState(false);

  useEffect(() => {
    if (life === 0) {
      alert("you dead");
      window.location.reload();
    }
  }, [life]);
  return (
    <div>
      <div className="quiz_container">
        <div className="info_bar">
          <div>Score {Score}</div>
          <div>
            progress {currentQuestion}/{modiflyQuiz.Progress}
          </div>
          <div>life: {life}</div>
        </div>
        <div className="action_block">
          {storyAct ? (
            <Story_Act
              modiflyQuiz={modiflyQuiz.Story_start}
              thisact={setStoryAct}
              nextact={setpronunciationAct}
            />
          ) : pronunciationAct ? (
            <Quiz_Pronunciation
              modiflyQuiz={modiflyQuiz.Quizcharacter}
              setScore={setScore}
              setCurrentQuestion={setCurrentQuestion}
              currentQuestion={currentQuestion}
              life={life}
              setLife={setLife}
              setCombo={setCombo}
              combo={combo}
              thisact={setpronunciationAct}
              nextact={setMissingWordAct}
            />
          ) : missingWordAct ? (
            <Quiz_missing
              modiflyQuiz={modiflyQuiz.QuizMissing_Word}
              setScore={setScore}
              setCurrentQuestion={setCurrentQuestion}
              currentQuestion={currentQuestion}
              life={life}
              setLife={setLife}
              setCombo={setCombo}
              combo={combo}
              thisact={setMissingWordAct}
              nextact={setSpellingAct}
            />
          ) : spellingAct ? (
            <Quiz_spelling
              modiflyQuiz={modiflyQuiz.QuizCorrect_Word}
              setScore={setScore}
              setCurrentQuestion={setCurrentQuestion}
              currentQuestion={currentQuestion}
              life={life}
              setLife={setLife}
              setCombo={setCombo}
              combo={combo}
              thisact={setSpellingAct}
              nextact={setSentenceAct}
            />
          ) : SentenceAct ? (
            <Quiz_Sentence
              modiflyQuiz={modiflyQuiz.QuizSentence}
              setScore={setScore}
              setCurrentQuestion={setCurrentQuestion}
              currentQuestion={currentQuestion}
              life={life}
              setLife={setLife}
              setCombo={setCombo}
              combo={combo}
              thisact={setSentenceAct}
              nextact={setMatchingAct}
            />
          ) : matchingAct ? (
            <Quiz_matching
              modiflyQuiz={modiflyQuiz.Quizmatching}
              setScore={setScore}
              setCurrentQuestion={setCurrentQuestion}
              currentQuestion={currentQuestion}
              life={life}
              setLife={setLife}
              setCombo={setCombo}
              combo={combo}
              thisact={setMatchingAct}
              nextact={setStoryAct_end}
            />
          ) : storyAct_end ? (
            <Story_Act
              modiflyQuiz={modiflyQuiz.Story_end}
              thisact={setStoryAct_end}
              nextact={setRewardAct}
            />
          ) : rewardAct ? (
            <End_Act
              modiflyQuiz={modiflyQuiz}
              thisact={setRewardAct}
              nextact={setIsPlayer}
              Score={Score}
              userdefine={userdefine}
            />
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Quiz;

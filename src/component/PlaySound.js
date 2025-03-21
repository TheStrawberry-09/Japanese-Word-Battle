function ButtonPlaySound(inputType) {
  const buttonSound = new Audio(
    "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/audio%2FSound%20Effect%2FButton%20Click.mp3?alt=media&token=138dcb13-2588-40f0-93ca-a1a5d9ad68e2"
  );
  const enterStage = new Audio(
    "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/audio%2FSound%20Effect%2FEnter%20Stage.wav?alt=media&token=3b0e2291-4df5-4b1f-81a0-f4f2e183df06"
  );
  const correctAnswer = new Audio(
    "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/audio%2FSound%20Effect%2FCorrect.wav?alt=media&token=abd0a602-e9c5-4fca-9f79-d18a5628a882"
  );
  const incorrectAnswer = new Audio(
    "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/audio%2FSound%20Effect%2FIncorrect.wav?alt=media&token=2f276a74-e7d4-4de8-9ef9-f51066bbe3ab"
  );
  const stageFail = new Audio(
    "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/audio%2FSound%20Effect%2FFail%20Stage.wav?alt=media&token=a428c089-b8d3-4442-a66d-3d8aeee211b2"
  );

  if (inputType === "button") {
    buttonSound.play();
  } else if (inputType === "enter") {
    enterStage.volume = 0.3;
    enterStage.play();
  } else if (inputType === "correct") {
    correctAnswer.volume = 0.3;
    correctAnswer.play();
  } else if (inputType === "incorrect") {
    incorrectAnswer.volume = 0.3;
    incorrectAnswer.play();
  } else if (inputType === "stagefail") {
    stageFail.volume = 0.3;
    stageFail.play();
  }
}
export default ButtonPlaySound;

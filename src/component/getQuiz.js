import { ref, onValue, getDatabase } from "firebase/database";
import { app } from "../firebase"; // Import your Firebase configuration
async function getQuiz(setQuiz, quiztype) {
  const shuffleArray = (array) => {
    return array
      .map((item) => ({ ...item, sort: Math.random() })) // Add random sort key
      .sort((a, b) => a.sort - b.sort) // Sort based on the random key
      .map(({ sort, ...item }) => item); // Remove the sort key
  };
  try {
    const databaseRef = ref(getDatabase(app), "Game_Level/" + "level01");
    onValue(databaseRef, (snapshot) => {
      const data = snapshot.val();
      if (quiztype === "character") {
        for (let i = 0; i < data.Quizcharacter.length; i++) {
          data.Quizcharacter[i].options = shuffleArray(
            data.Quizcharacter[i].options
          );
        }

        setQuiz(data.Quizcharacter);
      } else if (quiztype === "correct_Word") {
        const quizdata = data.Quizroadmap[0].Correct_Word;

        for (let j = 0; j < quizdata.length; j++) {
          quizdata[j].options = shuffleArray(quizdata[j].options);
        }

        setQuiz(quizdata);
      } else if (quiztype === "missing_Word") {
        const quizdata = data.Quizroadmap[0].Missing_Word;

        for (let j = 0; j < quizdata.length; j++) {
          quizdata[j].options = shuffleArray(quizdata[j].options);
        }

        setQuiz(quizdata);
      } else if (quiztype === "matching") {
        const quizdata = data.Quizmatching;
        quizdata.matchQuz = shuffleArray(quizdata.matchQuz);
        quizdata.matchAns = shuffleArray(quizdata.matchAns);
        console.log(quizdata);
        setQuiz(quizdata);
      }
    });
  } catch (error) {
    console.error("Error uploading data:", error);
  }
}
export default getQuiz;

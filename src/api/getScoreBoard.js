import { app } from "../firebase"; // Import your Firebase configuration
import { ref, onValue, getDatabase } from "firebase/database";
function GetScoreBoard(setdata){
    const dbRef = ref(getDatabase(app), `User_Data/`);
onValue(dbRef, (snapshot) => {
  const userData = snapshot.val();
  setdata(userData);
});
}
export default GetScoreBoard
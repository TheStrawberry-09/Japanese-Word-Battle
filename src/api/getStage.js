import { app } from "../firebase"; // Import your Firebase configuration
import { ref, onValue, getDatabase } from "firebase/database";
function GetStage(setdata){
    const dbRef = ref(getDatabase(app), `Game_Level/`);
onValue(dbRef, (snapshot) => {
  const userData = snapshot.val();
  setdata(userData);
});
}
export default GetStage

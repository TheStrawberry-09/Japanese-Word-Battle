import { app } from "../firebase"; // Import your Firebase configuration
import { ref, onValue, getDatabase } from "firebase/database";
function GetLifePoint(setdata,uid){
    const dbRef = ref(getDatabase(app), `User_Data/`+uid+"/stage_playing_life");
onValue(dbRef, (snapshot) => {
  const userData = snapshot.val();
  setdata(userData);
});
}
export default GetLifePoint
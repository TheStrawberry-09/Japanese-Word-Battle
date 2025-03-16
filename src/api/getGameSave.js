import { app } from "../firebase"; // Import your Firebase configuration
import { ref, onValue, getDatabase } from "firebase/database";
function GetLifePoint(setdata, uid) {
  const dbRef = ref(getDatabase(app), `User_Data/` + uid);
  onValue(dbRef, (snapshot) => {
    const userData = snapshot.val();
    const selectedUserData = {
      stage_playing_act: userData.stage_playing_act,
      stage_playing_name: userData.stage_playing_name,
      stage_playing_life: userData.stage_playing_life,
    };

    setdata(selectedUserData);
  });
}
export default GetLifePoint;

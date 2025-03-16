import { app } from "../firebase"; // Import your Firebase configuration
import { getDatabase, ref, update,onValue } from "firebase/database";
function SetReward(userId, updateStamp_Data, stamp_status) {
  const dbRef = ref(getDatabase(app), "User_Data/" + userId + "/Stamp_Data/" + updateStamp_Data);
  onValue(dbRef, (snapshot) => {
    const userData = snapshot.val();
    if(userData !== "trim"){
        const db = getDatabase(app);
        const termRef = ref(
          db,
          "User_Data/" + userId + "/Stamp_Data/" + updateStamp_Data
        );
        update(termRef, {
          Stamp: stamp_status,
        });
    }
  });
}
export default SetReward;

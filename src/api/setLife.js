import { app } from "../firebase"; // Import your Firebase configuration
import { getDatabase, ref, update} from "firebase/database";
function SetReward(LifePoint,userId) {
  const db = getDatabase(app);
  const termRef = ref(
    db,
    "User_Data/" + userId
  );
  update(termRef, {
    stage_playing_life: LifePoint,
  });
}
export default SetReward;

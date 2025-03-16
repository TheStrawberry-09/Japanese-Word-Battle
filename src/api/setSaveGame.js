import { app } from "../firebase"; // Import your Firebase configuration
import { getDatabase, ref, update} from "firebase/database";
function SetReward(userId, LifePoint, act, stage_play) {
  const db = getDatabase(app);
  const termRef = ref(
    db,
    "User_Data/" + userId
  );
  update(termRef, {
    stage_playing_life: LifePoint,
    stage_playing_act: act,
    stage_playing_name: stage_play,
  });
}
export default SetReward;
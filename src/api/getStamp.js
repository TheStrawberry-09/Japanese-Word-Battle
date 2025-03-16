import { app } from "../firebase"; // Import your Firebase configuration
import { ref, onValue, getDatabase } from "firebase/database";
function GetStamp(setdata){
    const dbRef = ref(getDatabase(app), `Stamp_Data/`);
onValue(dbRef, (snapshot) => {
  const userData = snapshot.val();
  setdata(userData);
});
}
export default GetStamp

import { app } from "../firebase"; // Import your Firebase configuration
import { ref, onValue, getDatabase } from "firebase/database";
function GetProfile(setdata,uid){
    const dbRef = ref(getDatabase(app), `User_Data/`+uid);
onValue(dbRef, (snapshot) => {
  const userData = snapshot.val();
  setdata(userData);
});
}
export default GetProfile
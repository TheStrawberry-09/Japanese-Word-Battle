import { auth } from "../firebase";
import PlaySound from "../component/PlaySound";

function LogoutUser({ setIsLogin, setuserdefine }) {
  const handleLogoutSuccess = () => {
    PlaySound("button");
    auth.signOut();
    setuserdefine({});
    setIsLogin(false);
  };
  return (
    <div onClick={handleLogoutSuccess}>
      <h2 className="change-page-button-text">Logout</h2>
    </div>
  );
}
export default LogoutUser;

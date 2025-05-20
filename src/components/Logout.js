import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";

export const Logout = ({ isAuth, setIsAuth }) => {
  const navigate = useNavigate();
  const logout = () => {
    // ログアウト
    if (!isAuth) {
      alert("ログインしてください");
      return;
    }
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      navigate("/login");
    });
  };
  return (
    <div>
      <p>ログアウトする</p>
      <button onClick={logout}>ログアウト</button>
    </div>
  );
};

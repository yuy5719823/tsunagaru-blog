import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export const Logout = ({ isAuth, setIsAuth }) => {
  const navigate = useNavigate();

  const logout = async () => {
    if (!isAuth) {
      alert("ログインしてください");
      return;
    }
    try {
      await signOut(auth);
      setIsAuth(false);
      navigate("/login");
    } catch (error) {
      console.error("ログアウトエラー:", error);
      alert("ログアウトに失敗しました");
    }
  };

  return (
    <div className="logoutPage">
      <p>ログアウトする</p>
      <button onClick={logout}>ログアウト</button>
    </div>
  );
};

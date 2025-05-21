import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export const Login = ({ isAuth, setIsAuth }) => {
  const navigate = useNavigate();
  
  const loginWithGoogle = async () => {
    if (isAuth) {
      alert("すでにログインしています");
      return;
    }
    try {
      await signInWithPopup(auth, provider);
      setIsAuth(true);
      navigate("/");
    } catch (error) {
      console.error("ログインエラー:", error);
      alert("ログインに失敗しました");
    }
  };

  return (
    <div className="login">
      <p className="login__message">ログインして始める</p>
      <button className="login__button" onClick={loginWithGoogle}>
        Googleでログイン
      </button>
    </div>
  );
};

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";

export const Login = ({ isAuth, setIsAuth }) => {
  const navigate = useNavigate();
  const loginWithGoogle = () => {
    // Googleでログイン
    if (isAuth) {
      alert("すでにログインしています");
      return;
    }
    signInWithPopup(auth, provider).then((result) => {
      localStorage.setItem("isAuth", true);
      setIsAuth(true);
      navigate("/");
    });
  };
  return (
    <div>
      <p>ログインして始める</p>
      <button onClick={loginWithGoogle}>Googleでログイン</button>
    </div>
  );
};

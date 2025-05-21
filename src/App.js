import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { CreatePost } from "./components/CreatePost";
import { Login } from "./components/Login";
import { Logout } from "./components/Logout";
import { NavBar } from "./components/NavBar";
import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth") === "true");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuth(true);
        localStorage.setItem("isAuth", "true");
      } else {
        setIsAuth(false);
        localStorage.removeItem("isAuth");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <NavBar isAuth={isAuth} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/login" element={<Login isAuth={isAuth} setIsAuth={setIsAuth} />} />
        <Route path="/logout" element={<Logout isAuth={isAuth} setIsAuth={setIsAuth} />} />
      </Routes>
    </Router>
  );
}

export default App;

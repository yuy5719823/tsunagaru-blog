import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faFilePen, faArrowRightToFile, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { auth } from "../firebase";

export const NavBar = ({ isAuth }) => {
  const [username, setUsername] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUsername(user.displayName || "ユーザー");
      } else {
        setUsername("");
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="nav">
      <button className="nav__hamburger" onClick={toggleMenu}>
        <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} />
      </button>
      <div className={`nav__menu ${isMenuOpen ? "nav__menu--open" : ""}`}>
        <Link to="/" className="nav__link" onClick={closeMenu}>
          <FontAwesomeIcon icon={faHouse} className="nav__icon" />
          ホーム
        </Link>
        {isAuth && (
          <Link to="/createpost" className="nav__link" onClick={closeMenu}>
            <FontAwesomeIcon icon={faFilePen} className="nav__icon" />
            記事投稿
          </Link>
        )}
        {isAuth ? (
          <>
            <span className="nav__username">{username}さん</span>
            <Link to="/logout" className="nav__link" onClick={closeMenu}>
              <FontAwesomeIcon icon={faArrowRightToFile} className="nav__icon" />
              ログアウト
            </Link>
          </>
        ) : (
          <Link to="/login" className="nav__link" onClick={closeMenu}>
            <FontAwesomeIcon icon={faArrowRightToFile} className="nav__icon" />
            ログイン
          </Link>
        )}
      </div>
    </nav>
  );
};

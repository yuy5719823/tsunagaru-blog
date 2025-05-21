import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faFilePen, faArrowRightToFile } from "@fortawesome/free-solid-svg-icons";
import { auth } from "../firebase";

export const NavBar = ({ isAuth }) => {
  return (
    <nav className="nav">
      <Link to="/" className="nav__link">
        <FontAwesomeIcon icon={faHouse} className="nav__icon" />
        ホーム
      </Link>
      {isAuth && (
        <Link to="/createpost" className="nav__link">
          <FontAwesomeIcon icon={faFilePen} className="nav__icon" />
          記事投稿
        </Link>
      )}
      {isAuth ? (
        <>
          <span className="nav__username">
            {auth.currentUser?.displayName || "ユーザー"}さん
          </span>
          <Link to="/logout" className="nav__link">
            <FontAwesomeIcon icon={faArrowRightToFile} className="nav__icon" />
            ログアウト
          </Link>
        </>
      ) : (
        <Link to="/login" className="nav__link">
          <FontAwesomeIcon icon={faArrowRightToFile} className="nav__icon" />
          ログイン
        </Link>
      )}
    </nav>
  );
};

import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faFilePen, faArrowRightToFile } from "@fortawesome/free-solid-svg-icons";

export const NavBar = ({ isAuth }) => {
  return (
    <nav>
      <Link to="/">
        <FontAwesomeIcon icon={faHouse} />
        ホーム
      </Link>
      {isAuth && (
        <Link to="/createpost">
          <FontAwesomeIcon icon={faFilePen} />
          記事投稿
        </Link>
      )}
      {isAuth ? (
        <Link to="/logout">
          <FontAwesomeIcon icon={faArrowRightToFile} />
          ログアウト
        </Link>
      ) : (
        <Link to="/login">
          <FontAwesomeIcon icon={faArrowRightToFile} />
          ログイン
        </Link>
      )}
    </nav>
  );
};

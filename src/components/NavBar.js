import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faFilePen, faArrowRightToFile } from "@fortawesome/free-solid-svg-icons";

export const NavBar = () => {
  return (
    <nav>
      <Link to="/">
        <FontAwesomeIcon icon={faHouse} />
        ホーム
      </Link>
      <Link to="/createpost">
        {" "}
        <FontAwesomeIcon icon={faFilePen} />
        記事投稿
      </Link>
      <Link to="/login">
        {" "}
        <FontAwesomeIcon icon={faArrowRightToFile} />
        ログイン
      </Link>
    </nav>
  );
};

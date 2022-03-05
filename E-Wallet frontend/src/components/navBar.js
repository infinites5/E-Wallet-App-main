import React from "react";
import { useHistory } from "react-router-dom";
import { Appcontext } from "./context";
import "../css/nav.css";

function NavBar() {
  let history = useHistory();

  const storeData = window.localStorage.getItem("infos");
  const answer = JSON.parse(storeData);
  // console.log(answer)

  const { setResult } = React.useContext(Appcontext);
  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-light bg-light"
        style={{ paddingTop: "16px", paddingBottom: "10px" }}
      >
        <a
          className="navbar-brand"
          href="/"
          style={{ color: "#4e73df", fontWeight: "bold" }}
        >
          DASHBOARD
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarTogglerDemo02"
          aria-controls="navbarTogglerDemo02"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse navss"
          id="navbarTogglerDemo02"
        >
          <ul className="navbar-nav">
            <div className="loginName">
              <i className="fas fa-user-circle navIc"></i>
              <li>
                <p className="userName">{answer.name}</p>
              </li>
              <div className="logStatus"></div>
            </div>
            <li className="nav-item">
              <button
                className="logOutbtn"
                onClick={() => {
                  window.localStorage.setItem("auth-key", "");
                  history.replace("/");
                  localStorage.clear();
                  setResult("");
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default NavBar;

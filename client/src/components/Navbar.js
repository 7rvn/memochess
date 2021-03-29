import * as React from "react";
import { useHistory } from "react-router-dom";

function Navbar() {
  const history = useHistory();
  return (
    <div className="navbar">
      <div
        className="nav-title"
        onClick={() => {
          history.push("/");
        }}
      >
        Chess
      </div>
      <div className="nav-subtitle">PGN with video</div>
      <div
        className="nav-link"
        onClick={() => {
          history.push("/gothamchess");
        }}
      >
        GothamChess
      </div>
      <div
        className="nav-link"
        onClick={() => {
          history.push("/white");
        }}
      >
        White openings
      </div>
      <div
        className="nav-link"
        onClick={() => {
          history.push("/black");
        }}
      >
        Black openings
      </div>
      <div className="nav-subtitle">PGN only</div>
      <div
        className="nav-link"
        onClick={() => {
          history.push("/custom");
        }}
      >
        import PGN
      </div>
    </div>
  );
}

export default Navbar;

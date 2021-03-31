import * as React from "react";
import { NavLink, Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar">
      <Link to="/" className="nl nav-title" id="stylizedlogo">
        <div>Memo</div>
        <div>Chess</div>
      </Link>
      <div className="nav-subtitle">PGN with video</div>
      <div className="divider"></div>
      <NavLink
        to="/overview/gothamchess"
        activeClassName="selected"
        className="nl nav-link"
      >
        Gothamchess
      </NavLink>
      <NavLink
        to="/overview/white-openings"
        activeClassName="selected"
        className="nl nav-link"
      >
        White Openings
      </NavLink>
      <NavLink
        to="/overview/black-openings"
        activeClassName="selected"
        className="nl nav-link"
      >
        Black Openings
      </NavLink>
      <div className="nav-subtitle">PGN only</div>
      <div className="divider"></div>
      <NavLink
        to="/custom-pgn"
        activeClassName="selected"
        className="nl nav-link"
      >
        import PGN
      </NavLink>
    </div>
  );
}

export default Navbar;

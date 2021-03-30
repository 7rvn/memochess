import * as React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar">
      <NavLink to="/" className="nl nav-title">
        Chess
      </NavLink>
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
      <NavLink to="/custom" activeClassName="selected" className="nl nav-link">
        import PGN
      </NavLink>
    </div>
  );
}

export default Navbar;

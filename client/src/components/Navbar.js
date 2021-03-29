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
        MemoChess
      </div>
    </div>
  );
}

export default Navbar;

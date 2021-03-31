import * as React from "react";
import { useHistory } from "react-router-dom";

function MobileNav({ title }) {
  const history = useHistory();
  return (
    <div
      className="mobile-nav"
      style={{ display: "none" }}
      onClick={() => {
        history.push("/");
      }}
    >
      <div id="mobile-logo">
        <div>Memo</div>
        <div>Chess</div>
      </div>
      <div id="mobile-title">{title}</div>
    </div>
  );
}

export default MobileNav;

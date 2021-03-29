import * as React from "react";
import { useHistory } from "react-router-dom";

import "../assets/css/overview.css";

import openings from "../assets/data/gothamchess";

function Overview() {
  const history = useHistory();
  return (
    <div id="main">
      <div className="openings-container">
        {Object.entries(openings).map((e) => {
          const [key, o] = e;
          return (
            <div
              className="opening"
              key={key}
              onClick={() => {
                history.push("/gothamchess/" + key);
              }}
            >
              <div className="thumbnail" id={key}></div>
              <div className="opening-title">{o.title}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Overview;

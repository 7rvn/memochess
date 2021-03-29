import * as React from "react";
import { useHistory, useParams } from "react-router-dom";

import "../assets/css/overview.css";

import openings from "../assets/data/youtube.json";

function Overview() {
  const history = useHistory();
  const routerParams = useParams();
  const overviewId = routerParams.id;

  let allopenings;
  if (!overviewId || overviewId === "all-openings") {
    allopenings = Object.entries(openings);
  } else if (overviewId === "white-openings") {
    allopenings = Object.entries(openings).filter(function (o) {
      return o[1].color === "white";
    });
  } else if (overviewId === "black-openings") {
    allopenings = Object.entries(openings).filter(function (o) {
      return o[1].color === "black";
    });
  } else {
    allopenings = Object.entries(openings).filter(function (o) {
      return o[1].author === overviewId;
    });
  }
  return (
    <div id="main">
      <div className="openings-container">
        {allopenings.map((e) => {
          const [key, o] = e;
          return (
            <div
              className="opening"
              key={key}
              onClick={() => {
                history.push("/opening/" + key);
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

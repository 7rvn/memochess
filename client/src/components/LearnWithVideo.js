import * as React from "react";
import { useParams } from "react-router-dom";

import "../assets/css/custompgn.css";
import "../assets/css/learnwithvideo.css";
import openings from "../assets/data/youtube.json";

import Chess from "chess.js";

import { constructPgnTree } from "../utils/pgnHelper";

import {
  handleActivatingPiece,
  handleMove,
  opponentMoves,
  restartLine,
  goToNode,
} from "../components/LearnPgn";

import Board from "../chessboard/src/components/Board";
import PgnViewer from "../components/PgnViewer";
import MobileNav from "../components/MobileNav";

function LearnWithVideo() {
  const routerParams = useParams();
  const openingId = routerParams.id;

  const opening = openings[openingId];

  function initialTree() {
    return constructPgnTree(opening.pgn);
  }
  const [game, setGame] = React.useState(new Chess());
  const [currentNode, setCurrentNode] = React.useState(initialTree);
  const [rootNode] = React.useState(initialTree);
  const [pgnVisible, setPgnVisible] = React.useState(true);

  const boardRef = React.useRef();

  function moveHandler(hexmove) {
    return handleMove({
      game: game,
      setGame: setGame,
      currentNode: currentNode,
      setCurrentNode: setCurrentNode,
      boardRef: boardRef,
      hexmove: hexmove,
    });
  }

  function activateHandler({ rank, file }) {
    return handleActivatingPiece({
      game: game,
      boardRef: boardRef,
      rank: rank,
      file: file,
    });
  }

  React.useEffect(() => {
    opponentMoves({
      currentNode: currentNode,
      setCurrentNode: setCurrentNode,
      game: game,
      setGame: setGame,
      boardRef: boardRef,
      color: opening.color,
    });
  }, [currentNode, game, opening]);

  function togglePgn() {
    setPgnVisible(pgnVisible ? false : true);
  }

  function restartHandler() {
    return restartLine({
      currentNode: currentNode,
      setCurrentNode: setCurrentNode,
      newGame: new Chess(),
      setGame: setGame,
      boardRef: boardRef,
    });
  }

  function goToNodeHandler(node) {
    return goToNode({
      node: node,
      newGame: new Chess(),
      setGame: setGame,
      setCurrentNode: setCurrentNode,
      boardRef: boardRef,
    });
  }

  return (
    <div id="main">
      <MobileNav title={opening.title}></MobileNav>
      <div id="appgame">
        <Board
          ref={boardRef}
          onMakeMove={moveHandler}
          onActivatePiece={activateHandler}
          initialOrientation={opening.color}
          colors={{
            darksquares: "var(--square)",
            highlight: "var(--square-alt)",
            wrong: "var(--red)",
          }}
        ></Board>
      </div>

      <div className="flex-column" id="sidebox">
        <div className="video-container" id={openingId}>
          <iframe
            id="yt-player"
            src={"https://www.youtube.com/embed/" + opening.youtube}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        <div className={"opening-title"} id="pgn-title">
          {opening.title}
        </div>

        <PgnViewer
          tree={rootNode}
          currentNode={currentNode}
          goToNode={goToNodeHandler}
          style={{
            filter: pgnVisible ? "blur(0)" : "blur(0.2em)",
            pointerEvents: pgnVisible ? "auto" : "none",
          }}
          id="pgn-viewer"
        ></PgnViewer>
        <div className="sidebox-buttons" id="pgn-buttons">
          <button
            className={
              currentNode && currentNode.nextMove
                ? "action-button"
                : "action-button underline-primary blink"
            }
            onClick={restartHandler}
          >
            Restart
          </button>
          <button className="action-button" onClick={togglePgn}>
            {pgnVisible ? "Hide PGN" : "Show PGN"}
          </button>
          <button
            id="yt-link-mobile"
            style={{ display: "none" }}
            className="action-button"
            onClick={() => {
              window.open("https://www.youtube.com/watch?v=" + opening.youtube);
            }}
          >
            Youtube Video
          </button>
        </div>
      </div>
    </div>
  );
}

export default LearnWithVideo;

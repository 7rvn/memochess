import * as React from "react";
import "../assets/css/custompgn.css";

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

import openings from "../assets/data/youtube.json";

function CustomPgn() {
  const pgn = openings["teste4"].pgn;
  const color = "white";
  function initialTree() {
    return constructPgnTree(pgn);
  }
  const [game, setGame] = React.useState(new Chess());
  const [currentNode, setCurrentNode] = React.useState(initialTree);
  const [pgnVisible, setPgnVisible] = React.useState(true);
  const [inputPgn, setInputPgn] = React.useState();
  const [inputVisible, setInputVisible] = React.useState(false);

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
      color: color,
    });
  }, [currentNode, game]);

  function togglePgn() {
    setPgnVisible(pgnVisible ? false : true);
  }

  function toggleInputPgn() {
    setInputVisible(inputVisible ? false : true);
  }

  function submitPgn(e) {
    e.preventDefault();
    console.log(e.target.title.value, e.target.color.value, e.target.pgn.value);
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
      <div id="appgame">
        <Board
          ref={boardRef}
          onMakeMove={moveHandler}
          onActivatePiece={activateHandler}
          initialOrientation={color}
          colors={{
            darksquares: "var(--square)",
            highlight: "var(--square-alt)",
            wrong: "var(--red)",
          }}
        ></Board>
      </div>
      <div className="flex-column" id="sidebox">
        <div
          className="sidebox-buttons"
          style={{ display: inputVisible ? "none" : "block" }}
        >
          <button
            className={
              currentNode.nextMove
                ? "action-button"
                : "action-button accent-alt"
            }
            onClick={restartHandler}
          >
            Restart
          </button>
          <button className="action-button" onClick={togglePgn}>
            {pgnVisible ? "Hide PGN" : "Show PGN"}
          </button>
          <button
            className="action-button"
            onClick={toggleInputPgn}
            style={{ display: inputPgn ? "none" : "inline-block" }}
          >
            Load PGN
          </button>
        </div>

        <div
          id="inputView"
          style={{ display: inputVisible ? "block" : "none" }}
        >
          <div className="sidebox-container">
            <div className="divider"></div>

            <form id="pgn-form" autoComplete="off" onSubmit={submitPgn}>
              <label htmlFor="title" className="input-label">
                Name:
              </label>
              <input
                type="text"
                name="title"
                id="title-input"
                placeholder="Name of the opening"
              ></input>
              <label htmlFor="pgn-input" className="input-label">
                PGN:
                <textarea
                  type="text"
                  name="pgn"
                  id="pgn-input"
                  placeholder="Paste your PGN here"
                />
              </label>

              <legend className="input-label">Color:</legend>
              <input
                type="radio"
                id="radioWhite"
                name="color"
                value="white"
                defaultChecked
              ></input>
              <label
                htmlFor="radioWhite"
                className="radioLabel action-button-alt"
              >
                white
              </label>

              <input
                type="radio"
                id="radioBlack"
                name="color"
                value="black"
              ></input>
              <label
                htmlFor="radioBlack"
                className="radioLabel action-button-alt"
              >
                black
              </label>
              <button
                style={{
                  display: "block",
                  margin: "2em auto 0 auto",
                  fontSize: "1.3em",
                }}
                type="submit"
                className="action-button-alt"
                onSubmit={submitPgn}
              >
                Load PGN
              </button>
            </form>
            <div className="divider"></div>
          </div>
          <div className="sidebox-buttons">
            <button
              type="submit"
              className="action-button"
              onClick={toggleInputPgn}
            >
              Cancel
            </button>
          </div>
        </div>
        <PgnViewer
          tree={currentNode}
          currentNode={currentNode}
          goToNode={goToNodeHandler}
          style={{
            visibility: inputVisible ? "hidden" : "visible",
            filter: pgnVisible ? "blur(0)" : "blur(0.2em)",
            pointerEvents: pgnVisible ? "auto" : "none",
          }}
        ></PgnViewer>
      </div>
    </div>
  );
}

export default CustomPgn;

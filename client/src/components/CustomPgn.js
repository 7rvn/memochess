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
import MobileNav from "../components/MobileNav";

function CustomPgn() {
  function initialTree() {
    const localStorageValue = window.localStorage.getItem("inputPgn");
    if (localStorageValue !== "null" && localStorageValue !== null) {
      return constructPgnTree(JSON.parse(localStorageValue).pgn);
    } else {
      return null;
    }
  }

  function initialInput() {
    const localStorageValue = window.localStorage.getItem("inputPgn");
    if (localStorageValue !== "null" && localStorageValue !== null) {
      return JSON.parse(localStorageValue);
    } else {
      return null;
    }
  }
  const [game, setGame] = React.useState(new Chess());
  const [currentNode, setCurrentNode] = React.useState(initialTree);
  const [rootNode, setRootNode] = React.useState(initialTree);
  const [pgnVisible, setPgnVisible] = React.useState(true);
  const [inputPgn, setInputPgn] = React.useState(initialInput);
  const [inputVisible, setInputVisible] = React.useState(
    inputPgn ? false : true
  );

  const boardRef = React.useRef();

  function moveHandler(hexmove) {
    if (inputPgn) {
      return handleMove({
        game: game,
        setGame: setGame,
        currentNode: currentNode,
        setCurrentNode: setCurrentNode,
        boardRef: boardRef,
        hexmove: hexmove,
      });
    }
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
    if (!inputPgn) {
      return;
    }
    opponentMoves({
      currentNode: currentNode,
      setCurrentNode: setCurrentNode,
      game: game,
      setGame: setGame,
      boardRef: boardRef,
      color: inputPgn.color,
    });
  }, [currentNode, game, inputPgn]);

  React.useEffect(() => {
    if (inputPgn) {
      window.localStorage.setItem("inputPgn", JSON.stringify(inputPgn));
    }
  }, [inputPgn]);

  function togglePgn() {
    setPgnVisible(pgnVisible ? false : true);
  }

  function toggleInputPgn() {
    setInputVisible(inputVisible ? false : true);
  }

  function submitPgn(e) {
    e.preventDefault();

    const pgn = e.target.pgn.value;
    const title = e.target.title.value || "";
    const color = e.target.color.value;
    if (pgn) {
      setInputPgn({ pgn: pgn, title: title, color: color });
      const node = constructPgnTree(pgn);
      setCurrentNode(node);
      setRootNode(node);
      toggleInputPgn();
    }
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
      <MobileNav title={inputPgn?.title || "Import PGN"}></MobileNav>
      <div id="appgame">
        <Board
          ref={boardRef}
          onMakeMove={moveHandler}
          onActivatePiece={activateHandler}
          initialOrientation={inputPgn?.color || "white"}
          colors={{
            darksquares: "var(--square)",
            highlight: "var(--square-alt)",
            wrong: "var(--red)",
          }}
        ></Board>
      </div>
      <div className="flex-column" id="sidebox">
        <div
          className={"opening-title"}
          style={{
            display: inputPgn?.title && !inputVisible ? "block" : "none",
          }}
          id="pgn-title"
        >
          {inputPgn?.title}
        </div>

        <div
          id="inputView"
          style={{ display: inputVisible ? "block" : "none" }}
        >
          <div className={"opening-title"}>import PGN</div>
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
              style={{ display: inputPgn ? "inline-block" : "none" }}
            >
              Cancel
            </button>
          </div>
        </div>
        <PgnViewer
          tree={rootNode}
          currentNode={currentNode}
          goToNode={goToNodeHandler}
          style={{
            visibility: inputVisible ? "hidden" : "visible",
            filter: pgnVisible ? "blur(0)" : "blur(0.2em)",
            pointerEvents: pgnVisible ? "auto" : "none",
          }}
          id="pgn-viewer"
        ></PgnViewer>
        <div
          className="sidebox-buttons"
          style={{ display: inputVisible ? "none" : "inherit" }}
          id="pgn-buttons"
        >
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
            className="action-button"
            onClick={toggleInputPgn}
            style={{ display: inputPgn ? "inline-block" : "none" }}
          >
            Load PGN
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomPgn;

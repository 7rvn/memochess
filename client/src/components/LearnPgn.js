import { playSound } from "../chessboard/src/utils/utils";
import { algToHex, hexToSan } from "../utils/helper";
import { getGoodMoves } from "../utils/pgnHelper";

export function handleMove({
  game,
  hexmove,
  boardRef,
  setCurrentNode,
  setGame,
  currentNode,
}) {
  const move = game.move({
    from: hexToSan(hexmove.from.rank, hexmove.from.file),
    to: hexToSan(hexmove.to.rank, hexmove.to.file),
  });

  boardRef.current.setBoard(game.board());

  if (move) {
    move.flags = move.san.includes("+") ? move.flags + "+" : move.flags;
    playSound(move.flags);

    if (currentNode.nextMove) {
      const goodMoves = getGoodMoves(currentNode);
      const node = goodMoves.find((e) => e.move === move.san);
      const moveRecommended = node ? true : false;

      if (moveRecommended) {
        setGame(game);
        setCurrentNode(node);

        boardRef.current.addHighlights({
          squares: [hexmove.from, hexmove.to],
          type: "lastMove",
        });
      } else {
        boardRef.current.addHighlights({
          squares: [hexmove.from, hexmove.to],
          type: "wrongMove",
        });
        setTimeout(() => {
          game.undo();
          boardRef.current.setBoard(game.board());
          boardRef.current.addHighlights({
            squares: [],
            type: "wrongMove",
          });
        }, 777);
      }
    } else {
      boardRef.current.addHighlights({
        squares: [hexmove.from, hexmove.to],
        type: "lastMove",
      });
    }
  } else {
    const sanTo = hexToSan(hexmove.to.rank, hexmove.to.file);
    // if clicked own piece
    if (game.turn() === game.get(sanTo)?.color) {
      return "samecolor";
    }
  }
}

export function handleActivatingPiece({ game, boardRef, rank, file }) {
  const sanFrom = hexToSan(rank, file);
  const isTurn = game.turn() === game.get(sanFrom)?.color;

  if (!isTurn) {
    return false;
  }

  const out = game.moves({ verbose: true, square: sanFrom }).map((m) => {
    const hex = algToHex(m.to);
    const type =
      m.flags.includes("c") || m.flags.includes("e") ? "capture-hint" : "hint";
    return { rank: hex[0], file: hex[1], type: type };
  });

  boardRef.current.addHighlights({
    squares: out,
    type: "legalMoves",
  });
}

export function opponentMoves({
  currentNode,
  setCurrentNode,
  game,
  setGame,
  boardRef,
  color,
}) {
  if (currentNode.nextMove === null) {
    return;
  }
  if (game.turn() !== color[0]) {
    const goodMoves = getGoodMoves(currentNode);
    const node = goodMoves[Math.floor(Math.random() * goodMoves.length)];

    setTimeout(() => {
      const move = game.move(node.move);
      move.flags = move.san.includes("+") ? move.flags + "+" : move.flags;
      playSound(move.flags);
      setCurrentNode(node);
      setGame(game);
      boardRef.current.setBoard(game.board());
      const hexFrom = algToHex(move.from);
      const hexTo = algToHex(move.to);
      boardRef.current.addHighlights({
        squares: [
          { rank: hexFrom[0], file: hexFrom[1] },
          { rank: hexTo[0], file: hexTo[1] },
        ],
        type: "lastMove",
      });
    }, 777);
  }
}

export function restartLine({
  currentNode,
  setCurrentNode,
  newGame,
  setGame,
  boardRef,
}) {
  let node = currentNode;
  while (node.parent) {
    node = node.parent;
  }
  setCurrentNode(node);

  setGame(newGame);
  boardRef.current.setBoard(newGame.board());
  boardRef.current.addHighlights({ squares: [], type: "lastMove" });
}

export function goToNode({ node, newGame, setGame, setCurrentNode, boardRef }) {
  let path = [];
  const endNode = node;

  while (node.move) {
    path.push(node.move);
    node = node.parent;
  }

  while (path.length) {
    newGame.move(path.pop());
  }
  setGame(newGame);
  setCurrentNode(endNode);
  boardRef.current.setBoard(newGame.board());
}

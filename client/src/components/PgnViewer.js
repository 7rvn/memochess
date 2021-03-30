import * as React from "react";
import "../assets/css/pgnviewer.css";

function PgnViewer({ tree, currentNode, goToNode, style }) {
  function PGNMove({ status, node, moveNumber, moveText }) {
    return (
      <div className={"pgn-move" + status}>
        <div className="pgn-move-number">{moveNumber}</div>
        <div
          className="pgn-move-text"
          onClick={() => {
            goToNode(node);
          }}
        >
          {moveText}
        </div>
      </div>
    );
  }

  const [pgntree] = React.useState(tree);

  function constructPgnDivs(node, layer) {
    let variationStart = layer > 0 ? true : false;
    let variation = [];
    let newVariation = [];
    let cNode = node;
    if (!cNode.move) {
      cNode = cNode.nextMove;
    }
    while (cNode.nextMove) {
      let moveNumber;

      if (variationStart) {
        if (cNode.color === 0) {
          moveNumber = "(" + cNode.moveNumber + ".";
        } else {
          moveNumber = "(" + cNode.moveNumber + "...";
        }
        variationStart = false;
      } else {
        moveNumber = cNode.color === 1 ? cNode.moveNumber + "." : "";
      }
      variation.push(
        <PGNMove
          node={cNode}
          key={cNode.id}
          moveNumber={moveNumber}
          moveText={cNode.move}
          status={cNode.id === currentNode.id ? " current" : ""}
        ></PGNMove>
      );
      if (newVariation) {
        newVariation.forEach((e) =>
          variation.push(constructPgnDivs(e, layer + 1))
        );
        newVariation = [];
      }
      if (cNode.variation.length) {
        newVariation = cNode.variation;
      }
      cNode = cNode.nextMove;
    }

    variation.push(
      <PGNMove
        node={cNode}
        key={cNode.id}
        moveNumber={cNode.color === 1 ? cNode.moveNumber + "." : ""}
        moveText={cNode.move}
        status={cNode.id === currentNode.id ? " current" : ""}
      ></PGNMove>
    );

    if (layer !== 0) {
      variation.push(
        <div
          className="pgn-move-variation-end"
          key={cNode.id.toString() + "end"}
        >
          )
        </div>
      );
    }
    if (layer === 1) {
      return (
        <div className="variation" key={cNode.id}>
          {variation}
        </div>
      );
    } else {
      return variation;
    }
  }

  const variations = constructPgnDivs(pgntree, 0);
  return (
    <div id="pgn-viewer" style={style}>
      <div className="divider"></div>
      {variations}
      <div className="divider"></div>
    </div>
  );
}
export default PgnViewer;

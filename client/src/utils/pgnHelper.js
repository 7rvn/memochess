import { Node } from "./tree";

export function constructPgnTree(pgn) {
  // split by number + dots
  const pgn_processed = pgn
    .replace(/}\)/g, "} )")
    .replace(/(\d+\.+(?![^{]*})(?![^{]*}))/g, function (match) {
      return "DELIM_SPXI_777" + match;
    })
    .split("DELIM_SPXI_777");

  let root = new Node(null);
  let prevNode = root;
  let nodeId = 0;
  let variationEnd = false;
  let variationStart = false;
  let whiteRoots = [];

  pgn_processed.slice(1).forEach((e) => {
    console.log(e);

    let moveNo;
    let moveColor = 1;
    // split by white space
    e.split(/\s+(?![^{]*})(?![^{]*})/).forEach((s) => {
      // if not empty
      if (/\S/.test(s)) {
        // if number + dots
        if (/^\d+\.+$/.test(s)) {
          moveNo = s.match(/\d+/)[0];
          if (s.includes("..")) {
            moveColor = 2;
          }

          // if comment
        } else if (s.includes("{")) {
          // console.log("comment:", s);
        } else {
          // if s contains move (tested by checking for number)
          if (/\d/.test(s)) {
            const newNode = new Node(s.replace(")", "").replace("(", ""));
            nodeId++;
            newNode.id = nodeId;
            newNode.color = moveColor;
            newNode.moveNumber = moveNo;
            const moveColorVerbose = moveColor === 1 ? "white" : "black";
            console.log(moveNo + ".", moveColorVerbose, s);
            moveColor++;

            if (variationStart) {
              if (newNode.color === 2) {
                whiteRoots[whiteRoots.length - 1].addVariation(newNode);
              } else {
                whiteRoots[whiteRoots.length - 1].parent.addVariation(newNode);
              }
              variationStart = false;
            } else {
              prevNode.addChild(newNode);
            }

            prevNode = newNode;
          }

          // variation end
          if (s.includes(")")) {
            var count = (s.match(/\)/g) || []).length;
            console.log("over:", count);
            let i = 0;
            while (i < count) {
              prevNode = whiteRoots.pop();
              i++;
            }
          }
          // variation start
          if (s.includes("(")) {
            variationStart = true;
            if (prevNode.color === 1) {
              whiteRoots.push(prevNode);
            } else {
              whiteRoots.push(prevNode.parent);
            }
          }
        }
      }
    });
    console.log("-----------------------------------------");
  });
  // console.log(root);
  return root;
}

export function getGoodMoves(node) {
  const goodMoves = [node.nextMove];
  if (node.variation) {
    node.variation.forEach((element) => {
      goodMoves.push(element);
    });
  }
  return goodMoves;
}

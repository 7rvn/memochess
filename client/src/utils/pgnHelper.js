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
  let variationStart = false;
  let variationEnd = false;
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
              if (!variationEnd) {
                // console.log(
                //   "adding root prevNode:",
                //   prevNode,
                //   "newNode:",
                //   newNode
                // );
                if (prevNode.color === 1) {
                  whiteRoots.push(prevNode);
                } else {
                  whiteRoots.push(prevNode.parent);
                }
              } else {
                variationEnd = false;
              }

              if (newNode.color === 2) {
                whiteRoots[whiteRoots.length - 1].addVariation(newNode);
              } else {
                whiteRoots[whiteRoots.length - 1].parent.addVariation(newNode);
              }
              console.log("varitaion start");
              variationStart = false;
            }

            // if only variation end, no new start
            else if (variationEnd) {
              const whiteRoot = whiteRoots.pop();
              console.log("white root is:", whiteRoot);
              if (newNode.color === 1) {
                whiteRoot.nextMove.addChild(newNode);
              } else {
                whiteRoot.addChild(newNode);
              }

              console.log("varitaion end");
              variationEnd = false;
            } else {
              prevNode.addChild(newNode);
            }

            prevNode = newNode;
          }

          if (s.includes("(")) {
            variationStart = true;
          }
          if (s.includes(")")) {
            variationEnd = true;
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

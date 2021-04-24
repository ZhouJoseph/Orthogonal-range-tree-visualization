var leafNodeID = {};
var treeNodeID = 0;
var leafIDCounter = -1;
// followed are the rangeTree Algorithm
function createNode(
  isleaf,
  val,
  left = null,
  right = null,
  assoc = null,
  parent = null,
  x = null,
  y = null
) {
  var id = -1;
  var leafID = null;
  if (isleaf) {
    var leafkey = val[0] + ";" + val[1];
    if (leafkey in leafNodeID) {
      leafID = leafNodeID[leafkey];
    } else {
      leafID = leafIDCounter--;
      leafNodeID[leafkey] = leafID;
    }
  }
  id = treeNodeID++;
  return {
    val: val,
    left: left,
    right: right,
    assoc: assoc,
    isleaf: isleaf,
    parent: parent,
    id: id,
    leafID: leafID,
  };
}

function splitInHalf(p, alignment = true) {
  if (alignment) {
    p.sort(function (a, b) {
      return a[0] - b[0];
    });
  } else {
    p.sort(function (a, b) {
      return a[1] - b[1];
    });
  }
  var mid = Math.ceil(p.length / 2);
  var leftHalf = p.slice(0, mid);
  var rightHalf = p.slice(mid, p.length);
  var result = {
    mid: mid - 1,
    leftHalf: leftHalf,
    rightHalf: rightHalf,
  };
  return result;
}

function build2DRangeTree(p, alignment = true, parent = null) {
  if (p.length === 1) {
    var node = createNode(true, p[0]);
    node.parent = parent;
    return node;
  } else {
    var result = splitInHalf(p, alignment);
    var node = createNode(
      false,
      alignment ? p[result.mid][0] : p[result.mid][1]
    );
    var leftNode = build2DRangeTree(result.leftHalf, alignment, node);
    var rightNode = build2DRangeTree(result.rightHalf, alignment, node);
    node.left = leftNode;
    node.right = rightNode;
    node.assoc = alignment ? build2DRangeTree(p, false) : null;
    node.parent = parent;
    return node;
  }
}

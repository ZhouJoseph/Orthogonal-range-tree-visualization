function drawTreeNode() {
  var dots = treeSVG.selectAll("g").data(treeData).enter().append("g");
  dots
    .append("circle")
    .attr("class", function (dp) {
      if (dp[0].leafID) {
        return (
          dp[0].id.toString() +
          "node hovercursor " +
          dp[0].leafID.toString() +
          "leaf"
        );
      }
      return dp[0].id.toString() + "node hovercursor";
    })
    .on("mouseover", function (dp) {
      var classes = d3.select(this).attr("class").split(" ");
      var id = "";
      if (classes.length === 3) {
        id = "." + classes[2];
        $(id).attr("r", enlargedCircleSize);
      }
      id = "." + classes[0];
      var explainer = id + "." + id.match(/\d+/) + "explain";
      $(explainer).css("fill", d3.select(this).style("fill"));
    })
    .on("mouseout", function (dp) {
      var classes = d3.select(this).attr("class").split(" ");
      var id = "";
      if (classes.length === 3) {
        id = "." + classes[2];
        $(id).attr("r", normalCircleSize);
      }
      id = "." + classes[0];
      var explainer = id + "." + id.match(/\d+/) + "explain";
      $(explainer).css("fill", whiteColor);
    })
    .attr("cx", function (dp) {
      return dp[0].x;
    })
    .attr("cy", function (dp) {
      return dp[0].y;
    })
    .attr("r", 5)
    .style("fill", function (dp) {
      return dp[1];
    });
  dots
    .append("text")
    .attr("class", function (dp) {
      if (dp[0].leafID) {
        return (
          dp[0].id.toString() +
          "node hovercursor " +
          dp[0].leafID.toString() +
          "leaf"
        );
      }
      return dp[0].id.toString() + "node hovercursor";
    })
    .on("mouseover", function (dp) {
      var classes = d3.select(this).attr("class").split(" ");
      var id = "";
      if (classes.length === 3) {
        id = "." + classes[2];
        $(id).attr("r", enlargedCircleSize);
      }
      id = "." + classes[0];
      var explainer = id + "." + id.match(/\d+/) + "explain";
      $(explainer).css("fill", d3.select(this).style("fill"));
    })
    .on("mouseout", function (dp) {
      var classes = d3.select(this).attr("class").split(" ");
      var id = "";
      if (classes.length === 3) {
        id = "." + classes[2];
        $(id).attr("r", normalCircleSize);
      }
      id = "." + classes[0];
      var explainer = id + "." + id.match(/\d+/) + "explain";
      $(explainer).css("fill", whiteColor);
    })
    .attr("dx", function (dp) {
      return dp[0].x + 10;
    })
    .attr("dy", function (dp) {
      return dp[0].y + 5;
    })
    .text(function (dp) {
      if (Array.isArray(dp[0].val)) {
        return dp[0].val.slice(0, 2).toString();
      } else {
        return dp[0].val;
      }
    })
    .style("fill", whiteColor);
}

function drawTreeBranch() {
  var branches = treeSVG.selectAll("line").data(treeBranch).enter();
  branches
    .append("line")
    .style("stroke", "#fdfdfd80")
    .style("stroke-width", 3)
    .attr("x1", function (dp) {
      return dp[0];
    })
    .attr("y1", function (dp) {
      return dp[1] - 1;
    })
    .attr("x2", function (dp) {
      return dp[2];
    })
    .attr("y2", function (dp) {
      return dp[3] + 1;
    });
}

// draw the assoc tree
// logic is the same
// we would init the node at different positions though,
// so we need to pass that information in,
// use the node's position as the init position
async function drawAssocTree(node, initX, initY, maxlevel) {
  if (node === null) {
    return;
  }
  var p = node;
  var stack = [];
  var levelRange = 50;
  var nodeRange = 15;
  var initNodeRange = nodeRange * 2 ** maxlevel;
  // node, level, left/right, x
  stack.push([p, 0, 0, initY]);
  while (stack.length !== 0) {
    var info = stack.pop();
    var n = info[0];
    var level = info[1];
    var childposition = info[2];
    var yposition = info[3];
    n.y = yposition;
    n.x = initX + level * levelRange;
    if (!n.isleaf) {
      if (n.left) {
        stack.splice(0, 0, [
          n.left,
          level + 1,
          -1,
          yposition + initNodeRange / 2 ** (level + 1),
        ]);
        // node, level, x, y
        // x and y can be calculated from level: x = nodeRange * (2 ** (level + 1)), y += level * levelRange;
      }
      if (n.right) {
        stack.splice(0, 0, [
          n.right,
          level + 1,
          1,
          yposition - initNodeRange / 2 ** (level + 1),
        ]);
      }
    }
    if (n.parent) {
      treeBranch.push([n.x, n.y, n.parent.x, n.parent.y]);
    }
    drawTreeBranch();
    treeData.push([n, whiteColor]);
    drawTreeNode();
    await timer(0);
  }
}

async function drawEntireTree(node) {
  if (node === null) {
    return;
  }
  var p = node;
  var stack = [];
  var initX = $("#tree").width() / 2 - 20;
  var initY = 300;
  var levelRange = 250;
  var nodeRange = 52;
  var maxlevel = 0;

  // find maxLevel
  stack.push([p, 0]);
  while (stack.length !== 0) {
    var info = stack.pop();
    var n = info[0];
    var level = info[1];
    if (level > maxlevel) {
      maxlevel = level;
    }
    if (!n.isleaf) {
      if (n.left) {
        stack.push([n.left, level + 1]);
      }
      if (n.right) {
        stack.push([n.right, level + 1]);
      }
    }
  }

  var initNodeRange = nodeRange * 2 ** maxlevel;
  // node, level, 0/-1/1 -> root/left/right, x position
  p = node;
  stack.push([p, 0, 0, initX]);
  while (stack.length !== 0) {
    var info = stack.pop();
    var n = info[0];
    var level = info[1];
    var childposition = info[2];
    var xposition = info[3];
    n.x = xposition;
    n.y = initY + level * (levelRange - level * 25);
    if (!n.isleaf) {
      if (n.left) {
        stack.splice(0, 0, [
          n.left,
          level + 1,
          -1,
          xposition - initNodeRange / 2 ** (level + 1),
        ]);
        // node, level, x, y
        // x and y can be calculated from level: x = nodeRange * (2 ** (level + 1)), y += level * levelRange;
      }
      if (n.right) {
        stack.splice(0, 0, [
          n.right,
          level + 1,
          1,
          xposition + initNodeRange / 2 ** (level + 1),
        ]);
      }
    }
    if (n.parent) {
      treeBranch.push([n.x, n.y, n.parent.x, n.parent.y]);
    }
    drawTreeBranch();
    treeData.push([n, whiteColor]);
    drawTreeNode();
    if (!n.isleaf) {
      await drawAssocTree(n.assoc, n.x + 60, n.y, maxlevel - level);
    }
    await timer(1);
  }
}

// to refresh the color of the points (to notify that point is in range, it's highlighted)
function refreshSvg() {
  // redraw range
  updateUserInputRange();
  // clear the data
  var temp = [];
  planeSVG.selectAll("g").data(temp).exit().remove();
  // add all points again
  addPointToPlane(0, 0, false);
}
// to refresh the tree (exit and then remove)
function refreshTree() {
  treeData = [];
  treeBranch = [];
  numMessage = 0;
  treeSVG.selectAll("text").data([]).exit().remove();
  treeSVG.selectAll("g").data(treeData).exit().remove();
  treeSVG.selectAll("line").data(treeBranch).exit().remove();
}

// to refresh the tree (exit and then remove)
function clearTree() {
  for (let j = 0; j < dps.length; j++) {
    dps[j][2] = blackColor;
  }
  refreshSvg();
  numMessage = 0;
  treeSVG.selectAll(".explaintext").data([]).exit().remove();
  treeSVG.selectAll("text").style("fill", whiteColor);
  treeSVG.selectAll("circle").style("fill", whiteColor);
}

function updateTextInput(val) {
  document.getElementById("textInput").value = val * defaultTimerWait + " ms";
}

function drawVisiting(node, alignment, range) {
  var xl = range.xleft;
  var xr = range.xright;
  var yb = range.ybottom;
  var yt = range.ytop;
  var p = node;
  var smaller = 0;
  var bigger = 0;
  if (alignment) {
    smaller = xl;
    bigger = xr;
  } else {
    smaller = yb;
    bigger = yt;
  }
  var messageNumber = numMessage++;
  var isSplit = false;
  if (p.isleaf) {
    if (alignment) {
      if (smaller <= p.val[0] && bigger >= p.val[0]) {
        isSplit = true;
      }
    } else {
      if (smaller <= p.val[1] && bigger >= p.val[1]) {
        isSplit = true;
      }
    }
  } else {
    if (smaller <= p.val && bigger >= p.val) {
      isSplit = true;
    }
  }
  var directionToGo = "";
  if (!node.isleaf && !isSplit) {
    if (bigger <= node.val) {
      directionToGo +=
        bigger.toString() +
        " <= " +
        node.val.toString() +
        ", try visiting its left child";
    } else {
      directionToGo +=
        bigger.toString() +
        " > " +
        node.val.toString() +
        ", try visiting its right child";
    }
  }
  var text =
    "Step " +
    messageNumber.toString() +
    ". Visiting node: " +
    (node.isleaf ? node.val[0] + "," + node.val[1] : node.val) +
    "..." +
    directionToGo;

  text += isSplit ? "found! Should start visiting both left and right" : "";
  treeSVG
    .append("text")
    .attr("class", node.id + "node " + node.id + "explain")
    .attr("dx", startingMessageX)
    .attr("dy", startingMessageY + messageNumber * messageRange)
    .text(text)
    .on("mouseover", function (dp) {
      var id = "." + d3.select(this).attr("class").split(" ")[0];
      $(id).attr("r", enlargedCircleSize);
    })
    .on("mouseout", function (dp) {
      var id = "." + d3.select(this).attr("class").split(" ")[0];
      $(id).attr("r", normalCircleSize);
    })
    .style("fill", whiteColor);
}
function drawS(node, alignment, range) {
  treeSVG
    .append("text")
    .attr("dx", node.x - 5)
    .attr("dy", node.y - 10)
    .text("S")
    .style("fill", "pink");
}

function drawFindSplit(range, alignment) {
  var xl = range.xleft;
  var xr = range.xright;
  var yb = range.ybottom;
  var yt = range.ytop;
  var smaller = 0;
  var bigger = 0;
  if (alignment) {
    smaller = xl;
    bigger = xr;
  } else {
    smaller = yb;
    bigger = yt;
  }

  var messageNumber = numMessage++;
  var text =
    "Step " +
    messageNumber.toString() +
    ". Looking for a " +
    (alignment ? "horizontal" : "vertial") +
    " split node within the range [" +
    smaller +
    "," +
    bigger +
    "]";
  treeSVG
    .append("text")
    .attr("dx", startingMessageX)
    .attr("dy", startingMessageY + messageNumber * messageRange)
    .text(text)
    .style("fill", whiteColor);
}

function drawNotFindSplit() {
  var messageNumber = numMessage++;
  var text =
    "Step " + messageNumber.toString() + ". Didn't find any split node...";
  treeSVG
    .append("text")
    .attr("dx", startingMessageX)
    .attr("dy", startingMessageY + messageNumber * messageRange)
    .text(text)
    .style("fill", whiteColor);
}

// due to degeneracy, split node needs to be more generous
async function findSplitNode(node, range, alignment = true, draw = true) {
  if (draw) {
    drawFindSplit(range, alignment);
  }

  var xl = range.xleft;
  var xr = range.xright;
  var yb = range.ybottom;
  var yt = range.ytop;
  var p = node;
  var smaller = 0;
  var bigger = 0;
  if (alignment) {
    smaller = xl;
    bigger = xr;
  } else {
    smaller = yb;
    bigger = yt;
  }
  while (p !== null) {
    if (draw) {
      var id = "." + p.id + "node";
      $(id).css("fill", "pink");
      drawVisiting(p, alignment, range);
    }

    if (p.isleaf) {
      // leaf node, so just report it to solve an important bug
      // if alignment, comparing to x
      if (alignment) {
        if (smaller <= p.val[0] && bigger >= p.val[0]) {
          if (draw) {
            drawS(p, alignment, range);
            await timer(timerWait);
          }

          return p;
        } else {
          if (draw) {
            await timer(timerWait);
            drawNotFindSplit();
          }
          return null;
        }
      } else {
        // not alignment, comparing to y
        if (smaller <= p.val[1] && bigger >= p.val[1]) {
          if (draw) {
            drawS(p, alignment, range);
            await timer(timerWait);
          }

          return p;
        } else {
          if (draw) {
            drawNotFindSplit();
            await timer(timerWait);
          }
          return null;
        }
      }
    } else {
      // the bigger >= p.val is necessary here (equal sign is necessary)
      // to deal with degeneracy
      if (smaller <= p.val && bigger >= p.val) {
        if (draw) {
          drawS(p, alignment, range);
          await timer(timerWait);
        }
        return p;
      } else {
        if (draw) {
          await timer(timerWait);
        }
        if (bigger <= p.val) {
          p = p.left;
        } else {
          p = p.right;
        }
      }
    }
  }
  drawNotFindSplit();
  return null;
}

// check if a point is within range or not
async function withinRange(point, range, node, draw = true) {
  var x = point[0];
  var y = point[1];
  var messageNumber = numMessage++;
  var text =
    "Step " +
    messageNumber +
    ". Checking if node: " +
    (node.val[0] + "," + node.val[1]) +
    " is it within query constraints?...";
  if (
    x >= range.xleft &&
    x <= range.xright &&
    y >= range.ybottom &&
    y <= range.ytop
  ) {
    if (draw) {
      treeSVG
        .append("text")
        .attr("dx", node.x - 10)
        .attr("dy", node.y + 10)
        .text("WR")
        .style("fill", "orange");
      // choose not to color it orange
      // var id = "." + node.id + "node";
      // $(id)
      //   .not("." + node.id + "explain")
      //   .css("fill", "orange");
      text += "[YES~!]";
      treeSVG
        .append("text")
        .attr("class", node.id + "node " + node.id + "explain")
        .attr("dx", startingMessageX)
        .attr("dy", startingMessageY + messageNumber * messageRange)
        .text(text)
        .on("mouseover", function (dp) {
          var id = "." + d3.select(this).attr("class").split(" ")[0];
          $(id).attr("r", enlargedCircleSize);
        })
        .on("mouseout", function (dp) {
          var id = "." + d3.select(this).attr("class").split(" ")[0];
          $(id).attr("r", normalCircleSize);
        })
        .style("fill", whiteColor);
      await timer(timerWait);
    }
    return true;
  }
  text += "[NO!!]";
  treeSVG
    .append("text")
    .attr("class", node.id + "node " + node.id + "explain")
    .attr("dx", startingMessageX)
    .attr("dy", startingMessageY + messageNumber * messageRange)
    .text(text)
    .on("mouseover", function (dp) {
      var id = "." + d3.select(this).attr("class").split(" ")[0];
      $(id).attr("r", enlargedCircleSize);
    })
    .on("mouseout", function (dp) {
      var id = "." + d3.select(this).attr("class").split(" ")[0];
      $(id).attr("r", normalCircleSize);
    })
    .style("fill", whiteColor);
  return false;
}

// report the entire subtree
async function reportSubtreeNode(node, draw) {
  if (node === null) {
    return [];
  }
  if (draw) {
    treeSVG
      .append("text")
      .attr("dx", node.x - 10)
      .attr("dy", node.y + 10)
      .text("RS")
      .style("fill", "lightgreen");
    var id = "." + node.id + "node";
    $(id).css("fill", "lightgreen");
    drawReportSubtreeVisit(node);
    await timer(timerWait);
  }

  var p = node;
  var stack = [];
  stack.push(p);
  var result = [];
  while (stack.length !== 0) {
    var n = stack.pop();
    if (!n.isleaf) {
      if (n.left !== null) {
        stack.push(n.left);
      }
      if (n.right !== null) {
        n.right && stack.push(n.right);
      }
    } else {
      result.push(n.val);
    }
  }
  return result;
}

function drawReportSubtreeVisit(node) {
  var messageNumber = numMessage++;
  var text =
    "Step " +
    messageNumber.toString() +
    ". Report entire subtree of node: " +
    (node.isleaf ? node.val[0] + "," + node.val[1] : node.val) +
    ". All constraints satisfied";
  treeSVG
    .append("text")
    .attr("class", node.id + "node " + node.id + "explain")
    .attr("dx", startingMessageX)
    .attr("dy", startingMessageY + messageNumber * messageRange)
    .text(text)
    .on("mouseover", function (dp) {
      var id = "." + d3.select(this).attr("class").split(" ")[0];
      $(id).attr("r", enlargedCircleSize);
    })
    .on("mouseout", function (dp) {
      var id = "." + d3.select(this).attr("class").split(" ")[0];
      $(id).attr("r", normalCircleSize);
    })
    .style("fill", whiteColor);
}

function drawOneDRangeSearchVisit(node) {
  var messageNumber = numMessage++;
  var text =
    "Step " +
    messageNumber.toString() +
    ". OneD Range Searching Node: " +
    (node.isleaf ? node.val[0] + "," + node.val[1] : node.val) +
    ". All its subtrees satisfy horizontal constraints";
  treeSVG
    .append("text")
    .attr("class", node.id + "node " + node.id + "explain")
    .attr("dx", startingMessageX)
    .attr("dy", startingMessageY + messageNumber * messageRange)
    .text(text)
    .on("mouseover", function (dp) {
      var id = "." + d3.select(this).attr("class").split(" ")[0];
      $(id).attr("r", enlargedCircleSize);
    })
    .on("mouseout", function (dp) {
      var id = "." + d3.select(this).attr("class").split(" ")[0];
      $(id).attr("r", normalCircleSize);
    })
    .style("fill", whiteColor);
}

// range search on the y axis
async function oneDRangeSearch(node, range, draw) {
  var xl = range.xleft;
  var xr = range.xright;
  var yb = range.ybottom;
  var yt = range.ytop;
  // console.log("oneDRangeSearch");
  if (draw) {
    var id = "." + node.id + "node";
    $(id).css("fill", "lightblue");
    drawOneDRangeSearchVisit(node);
    await timer(timerWait);
  }

  if (node.isleaf) {
    if (await withinRange(node.val, range, node, draw)) {
      return [node.val];
    }
    return [];
  }
  var vsplit = await findSplitNode(node.assoc, range, false, draw);
  // console.log("oneDRange Split Node", vsplit);
  if (vsplit === null) {
    return [];
  }

  if (vsplit.isleaf) {
    if (await withinRange(vsplit.val, range, vsplit, draw)) {
      return [vsplit.val];
    } else {
      return [];
    }
  } else {
    var vl = vsplit.left;
    var resultingData = [];
    while (!vl.isleaf) {
      if (draw) {
        var id = "." + vl.id + "node";
        $(id).css("fill", "pink");
        drawTwoDRangeVisit(vl, range);
        await timer(timerWait);
      }

      if (yb <= vl.val) {
        resultingData = resultingData.concat(
          await reportSubtreeNode(vl.right, draw)
        );
        vl = vl.left;
      } else {
        vl = vl.right;
      }
    }
    if (draw) {
      var id = "." + vl.id + "node";
      $(id).css("fill", "pink");
      drawTwoDRangeVisit(vl, range);
      await timer(timerWait);
    }

    if (await withinRange(vl.val, range, vl, draw)) {
      resultingData.push(vl.val);
    }
    var vr = vsplit.right;
    while (!vr.isleaf) {
      if (draw) {
        var id = "." + vr.id + "node";
        $(id).css("fill", "pink");
        drawTwoDRangeVisit(vr, range);
        await timer(timerWait);
      }

      if (yt >= vr.val) {
        resultingData = resultingData.concat(
          await reportSubtreeNode(vr.left, draw)
        );
        vr = vr.right;
      } else {
        vr = vr.left;
      }
    }
    if (draw) {
      var id = "." + vr.id + "node";
      $(id).css("fill", "pink");
      drawTwoDRangeVisit(vr, range);
      await timer(timerWait);
    }

    if (await withinRange(vr.val, range, vr, draw)) {
      resultingData.push(vr.val);
    }
    return resultingData;
  }
}

function drawTwoDRangeVisit(node, range) {
  var messageNumber = numMessage++;
  var text =
    "Step " +
    messageNumber.toString() +
    ". Visiting " +
    (node.isleaf ? node.val[0] + "," + node.val[1] : node.val);
  treeSVG
    .append("text")
    .attr("class", node.id + "node " + node.id + "explain")
    .attr("dx", startingMessageX)
    .attr("dy", startingMessageY + messageNumber * messageRange)
    .text(text)
    .on("mouseover", function (dp) {
      var id = "." + d3.select(this).attr("class").split(" ")[0];
      $(id).attr("r", enlargedCircleSize);
    })
    .on("mouseout", function (dp) {
      var id = "." + d3.select(this).attr("class").split(" ")[0];
      $(id).attr("r", normalCircleSize);
    })
    .style("fill", whiteColor);
}

async function twoDRangeSearch(node, range, draw = true) {
  var xl = range.xleft;
  var xr = range.xright;
  var yb = range.ybottom;
  var yt = range.ytop;
  var vsplit = await findSplitNode(node, range, true, draw);

  // console.log("twoDSplitNode", vsplit);
  if (vsplit === null) {
    return [];
  }
  if (vsplit.isleaf) {
    if (await withinRange(vsplit.val, range, vsplit, draw)) {
      return [vsplit.val];
    } else {
      return [];
    }
  } else {
    var vl = vsplit.left;
    var resultingData = [];
    while (!vl.isleaf) {
      if (draw) {
        var id = "." + vl.id + "node";
        $(id).css("fill", "pink");
        drawTwoDRangeVisit(vl, range);
        await timer(timerWait);
      }

      if (xl <= vl.val) {
        // console.log("xl <= vl.val, searching vl.right.assoc");
        resultingData = resultingData.concat(
          await oneDRangeSearch(vl.right, range, draw)
        );
        vl = vl.left;
      } else {
        vl = vl.right;
      }
    }

    if (draw) {
      var id = "." + vl.id + "node";
      $(id).css("fill", "pink");
      drawTwoDRangeVisit(vl, range);
      await timer(timerWait);
    }

    if (await withinRange(vl.val, range, vl, draw)) {
      resultingData.push(vl.val);
    }
    var vr = vsplit.right;
    while (!vr.isleaf) {
      if (draw) {
        var id = "." + vr.id + "node";
        $(id).css("fill", "pink");
        drawTwoDRangeVisit(vr, range);
        await timer(timerWait);
      }

      if (xr >= vr.val) {
        // console.log("xr > vl.val, searching vr.left.assoc");
        resultingData = resultingData.concat(
          await oneDRangeSearch(vr.left, range, draw)
        );
        vr = vr.right;
      } else {
        vr = vr.left;
      }
    }
    if (draw) {
      var id = "." + vr.id + "node";
      $(id).css("fill", "pink");
      drawTwoDRangeVisit(vr, range);
      await timer(timerWait);
    }

    if (await withinRange(vr.val, range, vr, draw)) {
      resultingData.push(vr.val);
    }
    return resultingData;
  }
}
var tree = null;
function randomizedQuery() {
  var randomizedRange = getRandomRange();
  updateUserInput(
    randomizedRange.xleft,
    randomizedRange.ybottom,
    randomizedRange.xright - randomizedRange.xleft,
    randomizedRange.ytop - randomizedRange.ybottom
  );
  refreshSvg();
}
function randomized() {
  points = getRandomPoints(8);
  for (let i = 0; i < points.length; i++) {
    if (dps.length < 16) {
      addPointToPlane(points[i][0], points[i][1]);
    } else {
      alert("for better display, at most 16 points are allowed.");
      break;
    }
  }
  refreshSvg();
  document.getElementById("buildTree").disabled = false;
}

async function buildTree() {
  document.getElementById("buildTree").disabled = true;
  refreshSvg();
  refreshTree();
  for (let j = 0; j < dps.length; j++) {
    dps[j][2] = blackColor;
  }
  var copydps = [];
  for (let j = 0; j < dps.length; j++) {
    copydps.push([dps[j][0], dps[j][1], dps[j][2]]);
  }
  tree = build2DRangeTree(copydps);
  console.log(tree);
  await drawEntireTree(tree);
  document.getElementById("findPoints").disabled = false;
  document.getElementById("buildTree").disabled = false;
}
// find points
async function findPoints() {
  // reinitializing
  document.getElementById("buildTree").disabled = true;
  document.getElementById("findPoints").disabled = true;
  document.getElementById("randomizedPoint").disabled = true;
  document.getElementById("randomizedQuery").disabled = true;
  document.getElementById("timerSwitch").disabled = true;
  // range
  refreshSvg();
  var range = userInputRange;

  // update user preferred timer
  if ($("#timerSwitch").is(":checked")) {
    timerWait = parseInt(defaultTimerWait * $("#timerSlider").val());
  } else {
    timerWait = 0;
  }

  var inRangeData = await twoDRangeSearch(tree, range);

  for (let i = 0; i < inRangeData.length; i++) {
    const inRange = inRangeData[i];
    for (let j = 0; j < dps.length; j++) {
      const actualData = dps[j];
      if (inRange[0] == actualData[0] && inRange[1] === actualData[1]) {
        dps[j][2] = "orange";
      }
    }
  }
  refreshSvg();
  document.getElementById("buildTree").disabled = false;
  document.getElementById("randomizedPoint").disabled = false;
  document.getElementById("randomizedQuery").disabled = false;
  document.getElementById("timerSwitch").disabled = false;
}

// testing
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
function getRandomRange() {
  var w = $("#plane").width();
  var h = $("#plane").height();
  var xl = getRandomInt(0, w);
  var xr = getRandomInt(0, w);
  var yt = getRandomInt(0, h);
  var yb = getRandomInt(0, h);
  var range = {
    xleft: Math.min(xl, xr),
    xright: Math.max(xl, xr),
    ytop: Math.max(yt, yb),
    ybottom: Math.min(yt, yb),
  };
  return range;
}
function getRandomPoints(n) {
  var points = [];
  var w = $("#plane").width() - 50;
  var h = $("#plane").height() - 50;
  for (let index = 0; index < n; index++) {
    points.push([getRandomInt(50, w), getRandomInt(50, h)]);
  }
  return points;
}

async function testRangeSearch(n) {
  // randomly generate 100 points
  // randomly choose four values as the range
  // do a search, and do a n^2 search
  // compare the result
  var points = getRandomPoints(n);
  var range = getRandomRange();
  var tree = build2DRangeTree(points);
  var inRangeData = await twoDRangeSearch(tree, range, false);
  var validation = [];
  for (let index = 0; index < points.length; index++) {
    const element = points[index];
    if (await withinRange(element, range, null, false)) {
      validation.push(element);
    }
  }
  for (let index = 0; index < validation.length; index++) {
    const element = validation[index];
    var found = false;
    for (let j = 0; j < inRangeData.length; j++) {
      const algoFound = inRangeData[j];
      if (algoFound[0] == element[0] && algoFound[1] == element[1]) {
        found = true;
        break;
      }
    }
    if (found === false) {
      console.log(range);
      console.log(points);
      console.log(tree);
      console.log(inRangeData);
      console.log(validation);
      console.log("couldnot find sth");
      return false;
    }
  }
  return inRangeData.length === validation.length ? true : false;
}

// n, number of tests
// m, number of points per test
async function multiTest(n, m) {
  console.log("running testing for ", n, "iterations with ", m, "test points");
  var successCount = 0;
  var failureCount = 0;
  for (let index = 0; index < n; index++) {
    result = await testRangeSearch(m);
    result ? (successCount += 1) : (failureCount += 1);
  }
  console.log("success rate:", successCount, "/", n);
}

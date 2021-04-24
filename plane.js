// event listener for the four input range
[inpX, inpY, inpWidth, inpHeight].forEach(function (e) {
  e.addEventListener("change", updateUserInputRange);
});

// update the value in the input fields
function updateUserInputRange() {
  userInputRange = {
    xleft: parseFloat(inpX.value),
    xright: parseFloat(inpX.value) + parseFloat(inpWidth.value),
    ytop: parseFloat(inpY.value) + parseFloat(inpHeight.value),
    ybottom: parseFloat(inpY.value),
  };
  planeSVG.selectAll("rect").remove();
  planeSVG
    .append("rect")
    .attr("x", parseFloat(inpX.value))
    .attr("y", parseFloat(inpY.value))
    .attr("width", parseFloat(inpWidth.value))
    .attr("height", parseFloat(inpHeight.value))
    .attr("stroke", blackColor)
    .attr("fill", "#ffffff50");
}
var planeWidth = $("#plane").width();
var planeHeight = $("#plane").height();
var rangeWidth = 200;
function updateUserInput(x, y, width, height) {
  $("#x").val(x.toString());
  $("#y").val(y.toString());
  $("#width").val(width.toString());
  $("#height").val(height.toString());
}
updateUserInput(
  planeWidth / 2 - rangeWidth / 2,
  planeHeight / 2 - rangeWidth / 2,
  rangeWidth,
  rangeWidth
);
updateUserInputRange();

function addPointToPlane(x, y, push = true) {
  // if push a new value,
  // we need to add it to dps
  if (push) {
    console.log("clicked:", x, y);
    if (dps.length != 0) {
      document.getElementById("buildTree").disabled = false;
    }
    var leafkey = x + ";" + y;
    var id = leafIDCounter--;
    leafNodeID[leafkey] = id;
    dps.push([x, y, blackColor, id + "leaf"]);
  }

  var dots = planeSVG.selectAll("g").data(dps).enter().append("g");
  dots
    .append("circle")
    .attr("class", function (dp) {
      return dp[3] + " hovercursor";
    })
    .on("mouseover", function (dp) {
      var id = "." + d3.select(this).attr("class").split(" ")[0];
      $(id).attr("r", enlargedCircleSize);
    })
    .on("mouseout", function (dp) {
      var id = "." + d3.select(this).attr("class").split(" ")[0];
      $(id).attr("r", normalCircleSize);
    })
    .attr("cx", function (dp) {
      return dp[0];
    })
    .attr("cy", function (dp) {
      return dp[1];
    })
    .attr("r", 5)
    .style("fill", function (dp) {
      return dp[2];
    });
  dots
    .append("text")
    .attr("class", function (dp) {
      return dp[3] + " hovercursor";
    })
    .on("mouseover", function (dp) {
      var id = "." + d3.select(this).attr("class").split(" ")[0];
      $(id).attr("r", enlargedCircleSize);
    })
    .on("mouseout", function (dp) {
      var id = "." + d3.select(this).attr("class").split(" ")[0];

      $(id).attr("r", normalCircleSize);
    })
    .attr("dx", function (dp) {
      return dp[0] + 5;
    })
    .attr("dy", function (dp) {
      return dp[1] - 5;
    })
    .text(function (dp) {
      return dp[0].toString() + "," + dp[1].toString();
    })
    .style("fill", function (dp) {
      return dp[2];
    });
}

// store the clicked points
planeSVG.on("click", function (e) {
  if (dps.length >= 16) {
    alert("for better display, at most16 points are allowed.");
    return;
  }
  var position = d3.pointer(e);
  var x = position[0];
  var y = position[1];
  addPointToPlane(x, y);
});

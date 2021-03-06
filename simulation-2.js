
/**
 * Calculates the error on y due to uncertainty on the slope.
 * @param {number} x - the value of x.
 * @param {number} mError - the uncertainty on the slope.
 * @return {number} The uncertainty on y from the slope.
 */
function errorFromSlope(x, mError) {
    return Math.abs(x*mError);
}

/**
 * Calculates the error on y due to uncertainty on x.
 * @param {number} m - the value of the slope.
 * @param {number} xError - the uncertainty on x.
 * @return {number} The uncertainty on y from x.
 */
function errorFromX(m, xError) {
    return Math.abs(m*xError);
}

/**
 * Calculates the total error on y by propagation through the equation y=mx.
 * @param {number} x - the value of x.
 * @param {number} m - the value of the slope.
 * @param {number} xError - the uncertainty on x.
 * @param {number} mError - the uncertainty on the slope.
 * @return {number} The total uncertainty on y.
 */
function totalError(x, m, xError, mError) {
    let yError_x = errorFromX(m, xError);
    let yError_m = errorFromSlope(x, mError);
    return Math.sqrt(yError_x*yError_x + yError_m*yError_m);
}

/* ----------------Initial Graph Setup---------------- */

var m = 1; // variable for slope

var trace0;
updateTrace0();

var xSliderValue = 5; // Position of the point, as set by the corresponding slider.
var errX = 1; // The uncertainty on x, as set by the corresponding slider.
var errM = .5; // The uncertainty on the slope, as set by the corresponding slider.
var errY = totalError(xSliderValue, m, errX, errM);
var xErrorBarsVisible = false;
var trace1;
updateTrace1();

var mErrorLinesVisible = false;
var slopeUpperBound, slopeLowerBound;
updateSlopeErrorLines();

var yErrorLinesVisible = false;
var yUpperBound, yLowerBound;
updateYErrorLines();

var xErrorLinesVisible = false;
var leftBound, rightBound;
updateXErrorLines();

var y_xErrorLinesVisible = false;
var errY_x = errorFromX(m, errX);
var y_xUpperBound, y_xLowerBound;
updateY_xErrorLines();

var y_mErrorLinesVisible = false;
var errY_m = errorFromSlope(xSliderValue, errM);
var y_mUpperBound, y_mLowerBound;
updateY_mErrorLines();

var data = [
    trace0,
    trace1
];

var layout = {
    showlegend: true,
    legend: {
        x: 0,
        xanchor: 'left',
        y: 1,
        bgcolor: 'rgba(0,0,0,0)'
    },
    margin: {
        l: 20,
        r: 20,
        t: 20,
        b: 20
    },
    xaxis: {
        range: [0, 10],
        autorange: false
    },
    yaxis: {
        range: [0, 10],
        autorange: false
    }
};

graph = document.getElementById('graph');
Plotly.newPlot(graph, data, layout, {staticPlot: true});

/* ------------Update Graph On Input-------------- */


/* ---------oninput functions----------*/

var xSlider = document.getElementById('xSlider');
xSlider.oninput = function() {
    xSliderValue = xSlider.value/10;

    errY = totalError(xSliderValue, m, errX, errM);
    updateTrace1();

    updateYErrorLines();

    updateXErrorLines();

    updateY_xErrorLines();

    updateY_mErrorLines();
    
    refreshGraph();
}

var xErrorMax = 2;
var xErrorSlider = document.getElementById('xErrorSlider');
xErrorSlider.oninput = function() {
    errX = xErrorMax*(xErrorSlider.value/100);
    document.getElementById('xErrorValue').innerHTML = "<b>Change the uncertainty on x</b> Current value: " + errX.toFixed(2);

    errY = totalError(xSliderValue, m, errX, errM);
    updateTrace1();

    updateYErrorLines();

    updateXErrorLines();

    updateY_xErrorLines();
    
    refreshGraph();
}

var slopeMax = 2;
var slopeSlider = document.getElementById('mSlider');
slopeSlider.oninput = function() {
    m = slopeMax*(slopeSlider.value/100);

    updateTrace0();

    errY = totalError(xSliderValue, m, errX, errM);
    updateTrace1();

    updateSlopeErrorLines();

    updateYErrorLines();

    updateY_xErrorLines();

    updateY_mErrorLines();
    
    refreshGraph();
}

var slopeErrorMax = 1;
var mErrorSlider = document.getElementById('mErrorSlider');
mErrorSlider.oninput = function() {
    errM = slopeErrorMax*(mErrorSlider.value/100);
    document.getElementById('mErrorValue').innerHTML = "<b>Change the uncertainty on the slope</b> Current value: " + errM.toFixed(2);

    errY = totalError(xSliderValue, m, errX, errM);
    updateTrace1();

    updateSlopeErrorLines();

    updateYErrorLines();

    updateY_mErrorLines();
    
    refreshGraph();
}

var xErrorBars = document.getElementById('xErrorBars');
xErrorBars.oninput = function() {
    xErrorBarsVisible = xErrorBars.checked;
    updateTrace1();
    refreshGraph();
}

var mErrorLines = document.getElementById('mErrorLines');
mErrorLines.oninput = function() {
    mErrorLinesVisible = mErrorLines.checked;
    updateSlopeErrorLines();
    refreshGraph();
}

var yErrorLines = document.getElementById('yErrorLines');
yErrorLines.oninput = function() {
    yErrorLinesVisible = yErrorLines.checked;
    updateYErrorLines();
    refreshGraph();
}

var xErrorLines = document.getElementById('xErrorLines');
xErrorLines.oninput = function() {
    xErrorLinesVisible = xErrorLines.checked;
    updateXErrorLines();
    refreshGraph();
}

var y_xErrorLines = document.getElementById('y_xErrorLines');
y_xErrorLines.oninput = function() {
    y_xErrorLinesVisible = y_xErrorLines.checked;
    updateY_xErrorLines();
    refreshGraph();
}

var y_mErrorLines = document.getElementById('y_mErrorLines');
y_mErrorLines.oninput = function() {
    y_mErrorLinesVisible = y_mErrorLines.checked;
    updateY_mErrorLines();
    refreshGraph();
}


/* ---------trace update functions--------- */

/**
 * Updates trace0 to reflect changes in stored variables.
 * Note that refreshGraph() must be called for changes to appear on graph.
 */
function updateTrace0() {
    trace0 = {
        x: [0, 10],
        y: [0, m*10],
        mode: 'lines',
        showlegend: false
    };
}

/**
 * Updates trace1 to reflect changes in stored variables.
 * @post Note that refreshGraph() must be called for changes to appear on graph.
 */
function updateTrace1() {
    trace1 = {
        x: [xSliderValue],
        y: [m*xSliderValue],
        error_y: {
            type: 'constant',
            value: errY
        },
        error_x: {
            type: 'constant',
            value: errX,
            visible: xErrorBarsVisible
        },
        type: 'scatter',
        showlegend: false
    };
}

/**
 * Updates the slope error line traces to reflect changes in stored variables.
 * @post Note that refreshGraph() must be called for changes to appear on graph.
 */
function updateSlopeErrorLines() {
    slopeUpperBound = {
        x: [0, 10],
        y: [0, (m+errM)*10],
        mode: 'lines',
        line: {
            width: 2,
            color: 'rgb(255, 0, 0)'
        },
        name: 'Slope error',
        visible: mErrorLinesVisible
    };

    slopeLowerBound = {
        x: [0, 10],
        y: [0, (m-errM)*10],
        mode: 'lines',
        line: {
            width: 2,
            color: 'rgb(255, 0, 0)'
        },
        showlegend: false,
        visible: mErrorLinesVisible
    };
}

function updateYErrorLines() {
    yUpperBound = {
        x: [0, 10],
        y: [m*xSliderValue + errY, m*xSliderValue + errY],
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 4,
            color: 'rgb(0, 153, 51)'
        },
        visible: yErrorLinesVisible,
        name: 'y error'
    };

    yLowerBound = {
        x: [0, 10],
        y: [m*xSliderValue - errY, m*xSliderValue - errY],
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 4,
            color: 'rgb(0, 153, 51)'
        },
        visible: yErrorLinesVisible,
        showlegend: false
    };
}

function updateXErrorLines() {
    leftBound = {
        x: [xSliderValue - errX, xSliderValue - errX],
        y: [0, 10],
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 2,
            color: 'rgb(204, 0, 0)'
        },
        visible: xErrorLinesVisible,
        name: 'x error'
    };

    rightBound = {
        x: [xSliderValue + errX, xSliderValue + errX],
        y: [0, 10],
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 2,
            color: 'rgb(204, 0, 0)'
        },
        visible: xErrorLinesVisible,
        showlegend: false
    };
}

function updateY_xErrorLines() {
    errY_x = errorFromX(m, errX);
    y_xUpperBound = {
        x: [0, 10],
        y: [m*xSliderValue + errY_x, m*xSliderValue + errY_x],
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 2,
            color: 'rgb(204, 0, 0)'
        },
        visible: y_xErrorLinesVisible,
        name: 'y_x error'
    };

    y_xLowerBound = {
        x: [0, 10],
        y: [m*xSliderValue - errY_x, m*xSliderValue - errY_x],
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 2,
            color: 'rgb(204, 0, 0)'
        },
        visible: y_xErrorLinesVisible,
        showlegend: false
    };
}

function updateY_mErrorLines() {
    errY_m = errorFromSlope(xSliderValue, errM);
    y_mUpperBound = {
        x: [0, 10],
        y: [m*xSliderValue + errY_m, m*xSliderValue + errY_m],
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 2,
            color: 'rgb(51, 204, 204)'
        },
        visible: y_mErrorLinesVisible,
        name: 'y_m error'
    };

    y_mLowerBound = {
        x: [0, 10],
        y: [m*xSliderValue - errY_m, m*xSliderValue - errY_m],
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 2,
            color: 'rgb(51, 204, 204)'
        },
        visible: y_mErrorLinesVisible,
        showlegend: false
    };
}

/**
 * Updates all elements on the graph to reflect changes caused by user input.
 */
function updateGraph() {

    updateTrace0();

    errY = totalError(xSliderValue, m, errX, errM);
    updateTrace1();

    updateSlopeErrorLines();

    updateYErrorLines();

    updateXErrorLines();

    updateY_xErrorLines();

    updateY_mErrorLines();
    
    refreshGraph();
}

/**
 * Refreshes the data array and calls Plotly.react to make changes appear on graph.
 */
function refreshGraph() {
    data = [
        trace0,
        trace1,
        slopeUpperBound,
        slopeLowerBound,
        yUpperBound,
        yLowerBound,
        leftBound,
        rightBound,
        y_xUpperBound,
        y_xLowerBound,
        y_mUpperBound,
        y_mLowerBound
    ];

    Plotly.react(graph, data, layout);
}
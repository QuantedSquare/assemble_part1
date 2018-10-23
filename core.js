var defaultParams = {
    introColor: "black",
    baseColor: "blue",
    triggerStepHeightPad: 0
};

var derniere_position_de_scroll_connue = 0;
var ticking = false;

var Step = 0;

function faitQuelquechose(position_scroll) {
    var stepHeight = window.innerHeight + defaultParams.triggerStepHeightPad;
    stepHeight -= 0.5 * stepHeight;
    //console.log("position_scroll: ", position_scroll);
    if (position_scroll < stepHeight && Step != 0) {
        Step = 0;
        stepDefault();
        console.log("Step: ", Step);
    }

    if (
        position_scroll > stepHeight &&
        position_scroll < stepHeight * 2 &&
        Step != 1
    ) {
        Step = 1;
        // stepOne();
        //stepPresident();
        stepIntro();
        console.log("Step: ", Step);
    }

    if (
        position_scroll > stepHeight * 3.5 &&
        position_scroll < stepHeight * 4.5 &&
        Step != 2
    ) {
        Step = 2;
        // stepOne();
        stepPresident();
        //stepIntro();
        console.log("Step: ", Step);
    }

    if (
        position_scroll > stepHeight * 5.5 &&
        position_scroll < stepHeight * 6.5 &&
        Step != 3
    ) {
        Step = 3;
        stepOne();
        //stepPresident();
        //stepIntro();
        console.log("Step: ", Step);
    }
}

window.addEventListener("scroll", function(e) {
    derniere_position_de_scroll_connue = window.scrollY;
    if (!ticking) {
        window.requestAnimationFrame(function() {
            faitQuelquechose(derniere_position_de_scroll_connue);
            ticking = false;
        });
    }
    ticking = true;
});

function drawBureau(nbLines, nbByLine, gapX, gapY) {
    var data = [];
    var x, y, res;
    for (var line = 0; line < nbLines; line++) {
        for (var nb = 0; nb < nbByLine; nb++) {
            res = { x: nb + gapX * nb, y: line + gapY * line };
            if (line == 0) res.y = line;
            if (nb == 0) res.x = nb;
            data.push(res);
        }
    }
    console.log("data: ", data.length);
    var linearScaleX = d3
        .scaleLinear()
        .domain([0, (nb + gapX) * nbByLine])
        .range([0, 600]);

    var linearScaleY = d3
        .scaleLinear()
        .domain([0, (line + gapY) * nbByLine])
        .range([0, 100]);

    data = data.map(e => {
        e.x = linearScaleX(e.x) + 300;
        e.y = linearScaleY(e.y);
        return e;
    });

    data.unshift({ x: 354, y: -285 + 300 });
    data.unshift({ x: 287, y: -285 + 300 });

    data.unshift({ x: 307, y: -259 + 300 });
    data.unshift({ x: 320, y: -259 + 300 });
    data.unshift({ x: 334, y: -259 + 300 });
    data.unshift({ x: 320, y: -249 + 300 });

    return data;
}

function drawAs() {
    var dataCercle = [];

    var bureau = drawBureau(4, 4, -0.7, 1);
    dataCercle = dataCercle.concat(bureau);
    console.log("bureau: ", bureau);

    dataCercle = dataCercle.concat(scalePos(testingTrigo(120, 40), 170, 510));
    dataCercle = dataCercle.concat(scalePos(testingTrigo(140, 50), 150, 530));
    dataCercle = dataCercle.concat(scalePos(testingTrigo(160, 58), 130, 550));
    dataCercle = dataCercle.concat(scalePos(testingTrigo(180, 60), 110, 570));
    dataCercle = dataCercle.concat(scalePos(testingTrigo(200, 60), 90, 590));
    dataCercle = dataCercle.concat(scalePos(testingTrigo(220, 70), 70, 610));
    dataCercle = dataCercle.concat(scalePos(testingTrigo(240, 70), 50, 630));

    dataCercle = dataCercle.concat(scalePos(testingTrigo(260, 70), 30, 650));
    dataCercle = dataCercle.concat(scalePos(testingTrigo(280, 77), 10, 670));
    console.log("NB data: ", dataCercle);
    return dataCercle;
}

var data = formatData();
var dataCercle = drawAs();

var deputies = data.filter(e => e.group == "députés");
var fonctionnaires = data.filter(e => e.group == "fonctionnaires");

var svgCercle = d3
    .select("#chart")
    .append("div")
    .classed("svg-container", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 750 400")
    .classed("svg-content-responsive", true);

var pointsDeputies = svgCercle
    .append("g")
    .attr("class", "deputies")
    .selectAll(".deputie")
    .data(deputies, d => d.id);

var newPointsDeputies = pointsDeputies.enter();

newPointsDeputies
    .append("circle")
    .classed("deputie", true)
    .attr("cx", (d, i) => {
        console.log("D: ", d);
        return dataCercle[i].x;
    })
    .attr("cy", (d, i) => {
        return -dataCercle[i].y + 300;
    })
    .attr("r", 3)
    .attr("height", 10)
    .attr("width", 10);

function stepDefault() {
    var toRemove = svgCercle.selectAll("circle").data(deputies, d => d.id);

    toRemove
        .exit()
        .transition()
        .duration(1000)
        .attr("r", 0)
        .remove();

    svgCercle
        .selectAll("circle")
        .filter(d => d.group == "députés")
        .transition()
        .duration(1000)
        .attr("cx", (d, i) => {
            return dataCercle[i].x;
        })
        .attr("cy", (d, i) => {
            return -dataCercle[i].y + 300;
        })
        .attr("r", 3)
        .attr("height", 10)
        .attr("width", 10)
        .attr("fill", defaultParams.introColor);
}

function stepIntro() {
    svgCercle
        .selectAll("circle")
        .filter(d => d.group == "députés")
        .attr("fill", defaultParams.introColor)
        .transition()
        .duration(1000)
        .attr("fill", defaultParams.baseColor);
}

function stepPresident() {
    svgCercle
        .selectAll("circle")
        .filter(d => d.group == "députés" && d.title == "president")
        .attr("fill", defaultParams.baseColor)
        .transition()
        .duration(1000)
        .attr("fill", "red");

    svgCercle
        .selectAll("circle")
        .filter(d => d.group == "députés" && d.title == "questeur")
        .attr("fill", defaultParams.baseColor)
        .transition()
        .duration(1000)
        .attr("fill", "blue");

    svgCercle
        .selectAll("circle")
        .filter(d => d.group == "députés" && d.title == "vice-president")
        .attr("fill", defaultParams.baseColor)
        .transition()
        .duration(1000)
        .attr("fill", "green");

    svgCercle
        .selectAll("circle")
        .filter(d => d.group == "députés" && d.title == "secrétaire")
        .attr("fill", defaultParams.baseColor)
        .transition()
        .duration(1000)
        .attr("fill", "yellow");
}

function stepOne() {
    var params = {
        svgWidth: 640,
        svgHeight: 600,
        squareWidth: 10,
        strokeWidth: 2
    };
    console.log("scroll");

    var pointsFonctionnaires = svgCercle
        .append("g")
        .attr("class", "fonctionnaires")
        .selectAll(".fonctionnaire")
        .data(fonctionnaires, d => d.id);

    var enterFonctionnaires = pointsFonctionnaires
        .enter()
        .append("circle")
        .transition()
        .duration(1000)
        .attr("r", 3)
        .attr("cx", function(d, i) {
            return coords(d.id, params).x;
        })
        .attr("cy", function(d, i) {
            return coords(d.id, params).y;
        });

    svgCercle
        .selectAll(".deputie")
        .merge(enterFonctionnaires)
        .transition()
        .duration(1000)
        .attr("cx", function(d, i) {
            return coords(d.id, params).x;
        })
        .attr("cy", function(d, i) {
            return coords(d.id, params).y;
        });
}

// ** Utilities **
function coords(squareCounter, params) {
    var nb = Math.floor(params.svgWidth / params.squareWidth);
    var y = Math.floor(squareCounter / nb);
    var x = (squareCounter % nb) * params.squareWidth;
    var coord = { x: x, y: y * params.squareWidth };
    return coord;
}

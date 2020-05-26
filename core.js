var defaultParams = {
    introColor: "#2C3A47",
    baseColor: "blue",
    deputiesColor: "",

    presidentColor: "",
    questeurColor: "",
    vice_presidentColor: "",
    secretaireColor: "",

    fonctionnairesColor: "",

    generalFoncsColor: "",
    specialFoncsColor: "",

    administrateursColor: "#FEA47F",
    administrateurs_adjointsColor: "#1B9CFC",
    assistants_directionColor: "#55E6C1",
    agentsColor: "#D6A2E8",
    redacteursColor: "#F97F51",
    gardiensColor: "#B33771",
    informatiqueColor: "#3B3B98",
    batimentColor: "#9AECDB",
    restaurationColor: "#6D214F",
    diversColor: "#182C61",

    triggerStepHeightPad: 0
};

// var derniere_position_de_scroll_connue = 0;
var ticking = false;

var marginTwenty = window.innerHeight * 0.25;

// Work on every navigators ?
window.addEventListener("scroll", function(e) {
    // derniere_position_de_scroll_connue = window.scrollY;
    // if (!ticking) {
    // window.requestAnimationFrame(function() {
    faitQuelquechose(window.scrollY);
    // ticking = false;
    // });
    // }
    // ticking = true;
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

    dataCercle = dataCercle.concat(scalePos(testingTrigo(120, 40), 170, 510));
    dataCercle = dataCercle.concat(scalePos(testingTrigo(140, 50), 150, 530));
    dataCercle = dataCercle.concat(scalePos(testingTrigo(160, 58), 130, 550));
    dataCercle = dataCercle.concat(scalePos(testingTrigo(180, 60), 110, 570));
    dataCercle = dataCercle.concat(scalePos(testingTrigo(200, 60), 90, 590));
    dataCercle = dataCercle.concat(scalePos(testingTrigo(220, 70), 70, 610));
    dataCercle = dataCercle.concat(scalePos(testingTrigo(240, 70), 50, 630));

    dataCercle = dataCercle.concat(scalePos(testingTrigo(260, 70), 30, 650));
    dataCercle = dataCercle.concat(scalePos(testingTrigo(280, 77), 10, 670));

    return dataCercle;
}

var data = formatData();
var dataCercle = drawAs();

var deputies = data.filter(e => e.group == "députés");
var fonctionnaires = data.filter(e => e.group == "fonctionnaires");

var params = {
    svgWidth: 670,
    svgHeight: 500,
    squareWidth: 10,
    strokeWidth: 2
};

var svgCercle = d3
    .select("#chart")
    .append("div")
    .classed("svg-container", true)
    .append("svg")
    // .attr("width", $(".is-three-fifths-desktop").width())
    // .attr("height", "700")
    //.attr("preserveAspectRatio", "xMinYMin meet")
    //.attr("viewBox", "0 0 " + $("#chart").width() + 1000)
    .attr("viewBox", "0 0 " + "700" + " 550")
//.classed("svg-content-responsive", true);

var pointsDeputies = svgCercle.append("g").attr("class", "deputies");

var pointsFonctionnaires = svgCercle
    .append("g")
    .attr("class", "fonctionnaires");

var newPointsDeputies = pointsDeputies
    .selectAll(".deputie")
    .data(deputies, d => d.id)
    .enter();

const generalTitles = [
    "administrateurs",
    "administrateurs_adjoints",
    "assistants_direction",
    "agents"
];

var deputiesColorMap = {
    députés: "rgba(255, 18, 120, 1)",
    president: "#EAB543",
    questeur: "#25CCF7",
    secretaire: "#FD7272",
    vice_president: "#58B19F"
};

function initialDraw() {
    svgCercle
        .selectAll(".fonctionnaire")
        .data(fonctionnaires, d => d.id)
        .enter()
        .append("circle")
        .attr("class", "fonctionnaire")
        .attr("r", 3)
        .attr("fill", "#FC427B")
        .attr("cx", function(d, i) {
            return coords(d.id, params).x + 10
        })
        .attr("cy", function(d, i) {
            return coords(d.id, params).y + 20 + marginTwenty;
        });

    newPointsDeputies
        .append("circle")
        .attr("class", "deputie")
        .attr("cx", (d, i) => {
            return dataCercle[i].x;
        })
        .attr("cy", (d, i) => {
            return -dataCercle[i].y + 300 + marginTwenty;
        })
        .attr("r", 3)
        .attr("height", 10)
        .attr("width", 10)
        .attr("opacity", 0);

    stepDefault();
}

initialDraw();

// Generic Draw
function drawPoints(drawInArc, fonctionnairesMargin, bothGroup) {
    var circles = svgCercle.selectAll("circle").data(data).transition().duration(1000)
        .attr("r", d => d.higlighted ? 4 : 3)
        .attr("opacity", d => d.opacity)
        .attr("fill", d => d.col);

    if (drawInArc) {
        circles.filter(d => d.group == "députés")
            .attr("cx", (d, i) => {
                return dataCercle[i].x;
            })
            .attr("cy", (d, i) => {
                return -dataCercle[i].y + 300 + (bothGroup ? 0 : marginTwenty);
            });
    } else {
        circles.filter(d => d.group == "députés")
            .attr("cx", function(d, i) {
                return coords(d.id, params).x + 10;
            })
            .attr("cy", function(d, i) {
                return coords(d.id, params).y + 10 + (bothGroup ? 0 : marginTwenty);
            });
    }

    // Add margin on non general. Data order important.
    if (fonctionnairesMargin) {
        circles.filter(d => d.group == "fonctionnaires" && generalTitles.indexOf(d.title) < 0)
            .attr("cy", function(d, i) {
                return coords(d.id, params).y + (bothGroup ? 100 : 20) + marginTwenty + 20;
            });
    } else {
        circles.filter(d => d.group == "fonctionnaires" && generalTitles.indexOf(d.title) < 0)
            .attr("cy", function(d, i) {
                return coords(d.id, params).y + (bothGroup ? 100 : 20) + marginTwenty;
            });
    }

    // Moove general Fonctionnaire when both Group
    circles.filter(d => d.group == "fonctionnaires" && generalTitles.indexOf(d.title) >= 0)
        .attr("cy", function(d, i) {
            return coords(d.id, params).y + (bothGroup ? 100 : 20) + marginTwenty;
        });

    return circles;
}

function stepDefault() {
    data.forEach(d => {
        if (d.group == "fonctionnaires") {
            d.higlighted = false;
            d.opacity = 0;
        }

        if (d.group == "députés") {
            d.higlighted = false;
            d.col = "black";
            d.opacity = 1;
        }
    });

    drawPoints(true);
}

function stepIntro() {
    data.forEach(d => {
        if (d.group == "fonctionnaires") {
            d.higlighted = false;
            d.col = "#FC427B"
            d.opacity = 0;
        }

        if (d.group == "députés") {
            d.higlighted = false;
            d.col = "rgba(255, 18, 120, 1)";
            d.opacity = 1;
        }
    });

    drawPoints(true);
}

function stepPresident() {
    data.forEach(d => {
        if (d.group == "fonctionnaires") {
            d.higlighted = false;
            d.col = "#FC427B"
            d.opacity = 0;
        }

        if (d.group == "députés") {
            d.higlighted = d.title != "députés";
            d.col = deputiesColorMap[d.title];
            d.opacity = d.title != "députés" ? 1 : 0.2;
        }
    });

    drawPoints(true);
}

function stepBoth() {
    data.forEach(d => {
        if (d.group == "fonctionnaires") {
            d.higlighted = false;
            d.col = "#FC427B"
            d.opacity = 1;
        }

        if (d.group == "députés") {
            d.higlighted = false;
            d.col = "#2953f3";
            d.opacity = 1;
        }
    });

    drawPoints(false);
}

function stepFonctionnaires() {
    data.forEach(d => {
        if (d.group == "fonctionnaires") {
            d.higlighted = false;
            d.col = generalTitles.indexOf(d.title) >= 0 ? "#FC427B" : "#58B19F";
            d.opacity = 1;
        }

        if (d.group == "députés") {
            d.higlighted = false;
            d.col = "blue";
            d.opacity = 0;
        }
    });

    // Commented code can replace the second argument set to true.
    // La selection ici est déjà une transition de 1 seconde.
    drawPoints(false, true)
    // .filter(d => d.group == "fonctionnaires" && generalTitles.indexOf(d.title) < 0)
    //     .attr("cy", function(d, i) {
    //         return coords(d.id, params).y + 20 + marginTwenty + 20;
    //     });
}

function stepFoncsGeneraux() {
    data.forEach(d => {
        if (d.group == "fonctionnaires") {
            d.higlighted = generalTitles.indexOf(d.title) >= 0;
            d.col = generalTitles.indexOf(d.title) >= 0 ? defaultParams[d.title + "Color"] : "#ecf0f1";
            d.opacity = 1;
        }

        if (d.group == "députés") {
            d.higlighted = false;
            d.col = "blue";
            d.opacity = 0;
        }
    });

    drawPoints(false, true);

}

function stepFoncsSpe() {
    data.forEach(d => {
        if (d.group == "fonctionnaires") {
            d.higlighted = generalTitles.indexOf(d.title) < 0;
            d.col = generalTitles.indexOf(d.title) < 0 ? defaultParams[d.title + "Color"] : "#ecf0f1";
            d.opacity = 1;
        }

        if (d.group == "députés") {
            d.higlighted = false;
            d.col = "blue";
            d.opacity = 0;
        }
    });

    drawPoints(false, true);
}

function stepFinal() {
    data.forEach(d => {
        if (d.group == "fonctionnaires") {
            d.higlighted = false;
            d.col = defaultParams[d.title + "Color"]
            d.opacity = 1;
        }

        if (d.group == "députés") {
            d.higlighted = false;
            d.col = deputiesColorMap[d.title];;
            d.opacity = 1;
        }
    });

    drawPoints(true, false, true);
}

var steps = [
    stepDefault, // Intro en bleu
    stepIntro, // Texte deputés --> Changement de couleur des députés
    stepPresident, // Higlights des députés spéciaux
    stepBoth, // Entré des fonctionnaires.
    stepFonctionnaires, // on vire les deputée et on fait la separation entre spe et generaux
    stepFoncsGeneraux, // Higlights des fonctionnaires generaux
    stepFoncsSpe, // Details des fonctionnaires spécialisés
    stepFinal, // Viz total avec toutes les couleurs
];

var currentStep = 0;

var encorNodes = [
    d3.select("#stepDefault").node(),
    d3.select("#stepIntro").node(),
    d3.select("#stepPresident").node(),
    d3.select("#stepBoth").node(),
    d3.select("#stepFonctionnaires").node(),
    d3.select("#stepFoncsGeneraux").node(),
    d3.select("#stepFoncsSpe").node(),
    d3.select("#stepFinal").node(),
]

function faitQuelquechose(positionScroll) {
    var screenCenter = window.innerHeight / 2;

    var scrollStep = encorNodes.reduce((nearestEncor, encorNode, encorIndex) => {
        var encorPos = encorNode.getBoundingClientRect(),
            encorY = encorPos.top;

        var dist = screenCenter - encorY;
        if (dist < 0) dist *= -1;

        // console.log(encorIndex, dist);

        if (dist < nearestEncor.dist) {
            return { dist: dist, step: encorIndex }
        } else return nearestEncor;
    }, { dist: 10000, step: 0 }).step;


    if (scrollStep != currentStep && steps[scrollStep]) {
        currentStep = scrollStep
        steps[scrollStep]();
    }
}

// ** Utilities **
function coords(squareCounter, params) {
    var nb = Math.floor(params.svgWidth / params.squareWidth);
    var y = Math.floor(squareCounter / nb);
    var x = (squareCounter % nb) * params.squareWidth;
    var coord = { x: x, y: y * params.squareWidth };
    return coord;
}
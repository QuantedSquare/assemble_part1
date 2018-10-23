function testingTrigo(radius, nbPoints) {
    var coords = [];
    var angle;

    nbPoints--;

    for (var i = 0; i <= nbPoints; i++) {
        if (i < nbPoints / 2)
            angle = radius * Math.cos((Math.PI / nbPoints) * i);
        else angle = radius * Math.cos((Math.PI / nbPoints) * i);
        coords.push({
            x: angle,
            y: radius * Math.sin((Math.PI / nbPoints) * i)
        });
    }
    return scalePos(coords, 0, radius * 2);
}

function scalePos(coords, minRange, maxRange) {
    var min = d3.min(coords, e => e.x);
    var max = d3.max(coords, e => e.x);

    var linearScale = d3
        .scaleLinear()
        .domain([min, max])
        .range([minRange, maxRange]);

    coords.map(e => {
        e.x = linearScale(e.x);
        return e;
    });
    return coords;
}

function formatData() {
    var data = [];
    data.push({ id: 0, group: "députés", title: "president" });
    for (var i = 1; i < 4; i++) {
        data.push({ id: i, group: "députés", title: "questeur" });
    }
    for (var i = 4; i < 10; i++) {
        data.push({ id: i, group: "députés", title: "vice-president" });
    }

    for (var i = 10; i < 22; i++) {
        data.push({ id: i, group: "députés", title: "secrétaire" });
    }

    for (var i = 22; i < 577; i++) {
        data.push({ id: i, group: "députés", title: "députés" });
    }

    for (var i = 577; i < 757; i++) {
        data.push({
            id: i,
            group: "fonctionnaires",
            title: "administrateurs"
        });
    }
    //console.log(data)
    for (var i = 757; i < 872; i++) {
        data.push({
            id: i,
            group: "fonctionnaires",
            title: "administrateurs_adjoints"
        });
    }
    for (var i = 872; i < 1044; i++) {
        data.push({
            id: i,
            group: "fonctionnaires",
            title: "assistants_direction"
        });
    }
    for (var i = 1044; i < 1453; i++) {
        data.push({
            id: i,
            group: "fonctionnaires",
            title: "agents"
        });
    }
    for (var i = 1453; i < 1517; i++) {
        data.push({
            id: i,
            group: "fonctionnaires",
            title: "rédacteurs"
        });
    }
    for (var i = 1517; i < 1573; i++) {
        data.push({
            id: i,
            group: "fonctionnaires",
            title: "gardiens"
        });
    }
    for (var i = 1573; i < 1600; i++) {
        data.push({
            id: i,
            group: "fonctionnaires",
            title: "informatique"
        });
    }
    for (var i = 1600; i < 1645; i++) {
        data.push({
            id: i,
            group: "fonctionnaires",
            title: "batiment"
        });
    }
    for (var i = 1645; i < 1698; i++) {
        data.push({
            id: i,
            group: "fonctionnaires",
            title: "restauration"
        });
    }
    for (var i = 1698; i < 1706; i++) {
        data.push({
            id: i,
            group: "fonctionnaires",
            title: "divers"
        });
    }

    return data;
}

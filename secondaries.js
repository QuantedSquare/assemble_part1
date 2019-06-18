var ctx = document.getElementById('chartAgeRep');
var ctx2 = document.getElementById('chartSexRep');
var myChart1 = new Chart(ctx, {
    type: 'doughnut',
    data: {
        datasets: [{
            data: [14, 30, 56],



            backgroundColor: ["#A2FFAE", "#6ECA7D", "#3A974E"]
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Red',
            'Yellow',
            'Blue'
        ]
    },
    options: {
        legend: false
    }
});


var myChart2 = new Chart(ctx2, {
    type: 'doughnut',
    data: {
        datasets: [{
            data: [64, 36],
            backgroundColor: ["#22A7F0", "#F62459"]
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Homme',
            'Femme'
        ]
    },
    options: {
        legend: false
    }
});

console.log("myChart: ", myChart1)
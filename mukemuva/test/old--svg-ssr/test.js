
const fs = require('fs')
const chart = require('svg-ssr');
// it can be just a string and it will be setted as id
let config = {
    id : 'chart_'+(new Date()).getTime(), // whatever
    debug: false, // if you want log time in terminal you can set it to true
    box : {
        width: 100, //not valid in pie chart
        height: 100 //not valid in pie chart
    }
}

const data = {
    value: [ 46.6, 38.9, 14.6 ],
    color: [ '#FF574D', '#3E8FF1', '#2BC7FF' ],
    name: [ 'type 1', 'type 2', 'type 3' ],
    unit: '%'
}

let chartSVGCode = chart.pie(data, config);

console.log(chartSVGCode)

fs.writeFileSync('./g.svg', chartSVGCode);


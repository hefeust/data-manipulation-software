
const make_data = require('./data.js')

const fs = require('fs')
const chart = require('svg-ssr');
// it can be just a string and it will be setted as id
let config = {
    id : 'chart_'+(new Date()).getTime(), // whatever
    debug: false, // if you want log time in terminal you can set it to true
    box : {
        width: 20       , //not valid in pie chart
        height: 20 //not valid in pie chart
    }
}

const draw_data = (series) => {
    const data = make_data(series)
    const  chartSVGCode = chart.line(data, config)

    console.log(data.series)

//    console.log(chartSVGCode)
    fs.writeFileSync('./g.svg', chartSVGCode);
}

module.exports = draw_data;


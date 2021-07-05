
const make_data = (series) => {
    const xLabels = []
    const yLabels = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    const data1 = []
    const data2 = []

    series.map((s) => {
        xLabels.push(s.x)

        data1.push({
            xValue: s.x,
            yValue: s.y1,
        })

        data2.push({
            xValue: s.x,
            yValue: s.y2
        })
    })

    const data = {   
        xAxis: { 
                type: 'linear',
                data: xLabels,
        },
        yAxis: { 
            type: 'linear',
            data: yLabels 
        }, 
        tooltip: { pointIndex: 1 }, 
        series: [
            {
                name: 'NB Ops Seconds',
                color: '#010101', 
                data: data1
            },  {
                name: 'Products',
                color: '#dd0101', 
                data: data2
            }
        ]
    }

    return data
}

module.exports = make_data


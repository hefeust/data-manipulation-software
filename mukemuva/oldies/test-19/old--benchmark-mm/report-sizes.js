

const mikmap = require('../../dist')

const Benchmark = require('benchmark')
const draw_data = require('../svg-ssr/graph.js')

const sizes = [
    10, 20, 50,    
       100, 200, 500,
    1000, 2000, 5000,
    10000, 20000, 50000,
   100 * 1000,  200 * 1000, 500 * 1000
]


const series = []

const suite = new Benchmark.Suite()

let mm = null

sizes.slice(0).map((size, sidx) => {
    suite.add(size, () => {
        const range = Array(size)
        
        range.map((_, ridx) => {
            mm.set({
                a: Math.random() * size,
                b: Math.random() * size,
                c: Math.random() * size
            }, { ridx })
        })
    })
})

suite.on('setup', (event) => {
    mm = mikmap.create_multimap('a', 'b', 'c')
})

        
suite.on('teardown', (event) => {
    console.log(mm.get_stats())
    console.log(String(event.target))
})

suite.on('cycle', (event) => {
    const x = parseInt(event.target.name)
    const stats = event.target.stats

    console.log(String(event.target))

    series.push({ 
        x: Math.log(x),
        y1: Math.log10(1 / stats.mean),
        y2: Math.log10(x / stats.mean)
    })


})

suite.on('complete', () => {
    console.log({ series })
})

suite.run()
/*
plot(series.map((s) => { 
    console.log(s)

    return s.y1
})).renderImage('./out.png')
*/

// draw_data(series)

series.map((s) => {
    console.log(s.x + ';' + s.y1 + ';' + s.y2)
})

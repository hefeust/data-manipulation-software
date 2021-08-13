

const mikmap = require('../../dist')
const Benchmark = require('benchmark')

const sizes = [
//    10, 20, 50,    
//       100, 200, 
    500,
    1000, 2000, 5000,
    10000, 20000, 50000,
   100 * 1000,  200 * 1000, 500 * 1000
]

const suite = new Benchmark.Suite()

let mm = null

sizes.map((size, sidx) => {
    suite.add('# '+ size, () => {
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
//    console.log(String(event.target))
    mm = mikmap.create_multimap('a', 'b', 'c')
})

        
suite.on('teardown', (event) => {
    console.log(mm.get_stats())
    console.log(String(event.target))
})


suite.on('cycle', (event) => {
    console.log(String(event.target))
})

suite.run()


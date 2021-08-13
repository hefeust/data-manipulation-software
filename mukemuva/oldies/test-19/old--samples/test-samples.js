

const dims = require('./dims-data.js')
const create_samples = require('./create-samples.js')

const product = dims.reduce((acc, range ) => { 
    console.log({ [range.name]: range.values.length  })
    return acc * range.values.length
}, 1)

const samples = create_samples(10 * 1000)

console.log(samples)

//for(let p in samples) console.log(p, samples[p])
//console.log([...samples])

let s = samples.next()

while(!s.done) {
    console.log(s.value)
   s =samples.next()    
}

console.log({ possible_items: product })


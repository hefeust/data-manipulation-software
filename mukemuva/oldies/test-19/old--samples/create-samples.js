
const dims = require('./dims-data.js')

const arrand = (arr) => arr[Math.floor(Math.random() * arr.length)]

module.exports = function* create_samples (max) {
    const samples = []

    for(let i =0; i < max; i++) {
        keys = { ref: i }

        for(d = 0; d < dims.length; d++) {
            keys[dims[d].name] = arrand(dims[d].values)
        }

        qty = Math.floor(Math.random() * 1000)    
//        samples.push({ keys, qty })
        
//        console.log({ keys, qty })
        yield { keys, qty }
    }
}


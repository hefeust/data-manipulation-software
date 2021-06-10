

const kesako = require('../../dist')

const a = 31*37 - 19 * 17 - 136
const b = 36
const r = 4

const mwc = kesako.create_mwc(a, b, r)

let seeds = new Array(r)

//for(let s = 0; s < r; s++) {
//    seeds[s] = Math.floor(Math.random() * b)
//}

seeds = [7, 9, 11, 13, 17, 19]

mwc.init(seeds)

// const MAX = 36 * 1000 * 1000
const MAX = 36 * 1000 * 1000 * 1000
const MAX_TESTS = 36 
const tracker = new Map()
let count = 0
let total = 0
let chunk = []
let key = ''

const trial = () => {

        let current = null

    for(i = 0; i < MAX_RUN; i++) {
        
    }

    return { moduulus, ratio }
}

const test_modulus = (a,  b, r) => {
    const mwc = ccreate_mwc(modulus, divider, size)    
    const seeds = create_seeds(divider, size)

    test_generator()
}

const run_tests = () => {
    for(z = 0; z < MAX_TESTS; z++) {
        m = compute_modulus()

        test_modulus(m)
    }

    test_modulus(m)
}

run_tests()



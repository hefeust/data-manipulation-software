
const is_prime = require('./find-primes.js')
const lib = require('../../dist')

//const candidates = [227627]
//const candidates = [83047]

const TEST_PASSES = 64
const DIVIDER = 26
const SIZE = 5
const STATS = []
const MAX_ITERATIONS = Math.pow(DIVIDER, SIZE)


const random_seeds = (x) => {
    let result = []
    
    for(let i = 0; i < x; i++) {
        result.push(Math.floor(Math.random() * DIVIDER - 1))
    }

    return result
//    return Math.floor(Math.random() * DIVIDER)
}



const test_pass = (modulus, seeds) => {
    const lookup = new Map()
    const mwc = lib.create_mwc(modulus, DIVIDER, SIZE)
    let value = 0
    let count = 0
    let shortened = '***'
    let generated = 0
    let collisions = 0
    let weighted = 0
    let keys = []

    mwc.init(seeds)

    for(let mi = 0; mi < MAX_ITERATIONS; mi++) {
        if(mi % 1000000 === 0) console.log(mi)

        value = lib.keys(mwc.next())
        shortened = value.substr(0, 3)
        count = lookup.get(shortened) || 0
        lookup.set(shortened, count + 1)
    }

    keys = Array.from(lookup.keys())

//    console.log(Array.from(lookup.keys()))

    keys.map((short) => {
        const count = lookup.get(short)

        generated += count

        if(count > Math.pow(DIVIDER, 2)) {
            collisions += DIVIDER * DIVIDER
//            weighted += count
        }
    })

    lookup.clear()

    return { 
        modulus, 
        generated,
        collisions, 
//        weighted: weighted / MAX_ITERATIONS,
        ratio: collisions / (keys.length * DIVIDER * DIVIDER)
    }
}

let best =  {
    modulus: 1,
    generated: 1000,
    collisions: 1000,
    ratio: 1
}

const test_generator = (candidate, idx) => {
    const seeds = random_seeds(SIZE * SIZE)
    const test = test_pass(candidate, seeds)

    console.log(idx + ' ' 
        + 'modulus: ' + candidate + ' ' 
        + 'generated: ' + test.generated + ' '
        + 'colls: ' + test.collisions + ' '
        + 'ratio: ' + test.ratio.toFixed(3)
    )

    if(test.generated > (0.9 * best.generated) && test.ratio < (0.9  * best.ratio)) {
        best = test

        console.log('**** FOUND BETTER THAN BEST *****')
        console.log(idx + ' ' 
            + 'modulus: ' + test.modulus + ' ' 
            + 'loops: ' + test.generated + ' '
            + 'ratio: ' + test.ratio
        )
        console.log('')
    }


}

const MIN = 997
const MAX = 100 * 1000 * 1000

const primes = []


// console.log('finding primes...')
/*
for(let i = MIN; i < MAX; i++) {
    if(i % 2 === 0) continue
    if(i % 3 === 0) continue
//    if(Math.random() < 0.90) continue

    if(i % (1000 * 1000) === 0) console.log(i)

    if(is_prime(i)) 
        primes.push(i)
}
*/
//console.log(primes.join(' '))
console.log({ primes: primes.length })

let randidx = 1
let idx = 0

for(let xp = MIN; xp < MAX; xp += randidx) {

    const safe = (xp  * Math.pow(DIVIDER, SIZE)) - 1

//    if(is_prime(xp) === false) {
//        continue
//    }

//    if(is_prime(safe) === false) {
//        continue    
//    }

    test_generator(xp, idx)        

    randidx = Math.floor(Math.random() * 1000)
    idx++
}


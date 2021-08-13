
const is_prime = require('./find-primes.js')

const lib = require('../../dist')

let primes = []

for(let i = 0; i < 10000; i++) {
    if(is_prime(i)) primes.push(i)
}

//console.log(primes.join(' '))
console.log(primes.length)

const safe_primes = []

primes.map((p) => {
    const s = 36 * p  - 1
    if(is_prime(s)) 
        safe_primes.push(s)
})


//console.log(safe_primes.join(' '))
console.log(safe_primes.length)

    
const TESTS_COUNT = 64
const TEST_PASSES = 64
const DIVIDER = 36
const SIZE = 4
const STATS = []

let MAX_ITERATIONS = Math.pow(DIVIDER, SIZE) * 0.5

const make_seeds = () => {
    const results = new Array(SIZE)

    for(let i = 0; i < SIZE; i++) {
        results[i] = Math.floor(Math.random() * DIVIDER)
    }

    return results
}

const test_generator = (modulus) => {
    const specs = {
        modulus,
        divider: 36,
        lag: 4
    }

    let mwc, 
        lookup,
        counter, 
        tested,
        collisions, 
        weighted, 
        c, 
        w,
        value, 
        values,
        results, 
        stats,
        best = MAX_ITERATIONS

    console.log('Testing generator wirg safe prime: ' + modulus)

    for(tp = 0; tp < TEST_PASSES; tp++) {
        tested = 1

        console.log('\t', { modulus, test_pass: tp })

        results = []
        mwc = lib.create_mwc(modulus, DIVIDER, SIZE)        
        mwc.init(make_seeds())        
        lookup = new Map()
        c = 0
        w = 0

        for(let mi = 0; mi < MAX_ITERATIONS; mi++) {
            value = lib.keys36(mwc.next())
            count = lookup.get(value) || 0
            lookup.set(value, count + 1)
        }

        values = Array.from(lookup.keys())
        collisions = 0
        weighted = 0
        
        values.map((number) => {
            const count = lookup.get(number)
    
            if(count > 1) {
                collisions++
                weighted += count
            }
        })        

        lookup.clear()

        results.push({ modulus, collisions, weighted})

        if(collisions >= 1.25 * best) break

        tested++
    }    

    results.map((result) => {
        c += result.collisions
        w += result.weighted
    })

    if(c / tested < best) {
        best = c / tested
    }

    stats = { 
        modulus, 
        collisions: c / TEST_PASSES,  
        weighted: w / TEST_PASSES
    }

    console.log('\t\t', stats)
    STATS.push(stats)
}

const test = () => {
    let sp = safe_primes

    sp = [227627, 119267, 245771]

    sp.slice(0).map((s) => {
        test_generator(s)
    })

    console.log(STATS.sort((s1, s2) => { 
        return s1.collisions - s2.collisions 
    }))
}

test()

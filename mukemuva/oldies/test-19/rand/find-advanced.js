w
const kesako = require('../../dist')

const TESTS_COUNT = 1024
const TEST_PASSES = 32
const DIVIDER = 36
const SIZE = 4

let MAX_ITERATIONS = Math.pow(DIVIDER, SIZE) * 0.05

const random_modulus = (divider, size) => {
    const coeffs = []
    let m = 0    
    let x = 0
    let signum = 1

    for(let s = 0; s < size; s++) {
        signum = (s === 0) ? 1 : (Math.random() > 0.5 ? 1 : -1)
        x = Math.floor(divider * Math.random()) * signum        

        if(x % 2 === 0) x = x - 1

        coeffs.push(x)
    }

    for(let w = 0; w < size; w++) {
        m += m * divider + coeffs[w]
    }

    return m
}

const random_seeds = (divider, size) => {
    const seeds = []

    for(let s = 0; s < size; s++) {
        seeds[s] = Math.floor(Math.random() * divider)
    }

    return seeds
}


const test_loop = (test, candidate) => {
//     console.log('### TEST LOOP')
    const { mwc, seeds } = test

//    console.log({ mwc, seeds })

    const lookup = new Map()
    let collisions = 0
    let key = null
    let counter = 0
    let effective_iterations = 1
    let first_crash = 0

//    max_iterations = 1000
    mwc.init(seeds)

    for(c =0; c < MAX_ITERATIONS; c++) {
        key = kesako.keys36(mwc.next())
    
        counter = lookup.get(key) || 0

        lookup.set(key, 1 + counter)

        if(counter > 1) {
            collisions++

            if(c < candidate.first_crash) {
                candidate.first_crash = c
                break

            }
        }

        effective_iterations++
    }    

//    console.log({ ratio: collisions / max_iterations  })

    return collisions / effective_iterations
}


const test_generator = (test, candidate) => {
    const { mwc } = test
    const ratios = []

    let seeds = []
    let result = 100
    let effective_passes = 1
    let sum = 0
    let ratio = 1

    for(let tp = 0; tp < TEST_PASSES; tp++) {
        console.log('\t TEST PASS #' + tp)

        seeds = random_seeds(DIVIDER, SIZE)
        test = { mwc, seeds }

        ratio = test_loop(test, candidate)
///        rations.push(test_loop(test))
        ratios.push(ratio)
        effective_passes++

        if(ratio > 1.1 * candidate.ratio) {
            break
        }
    }

//    console.log(results)
//    console.log({ ratio: collisions / max_iterations  })

    ratios.map((r) => {
        sum += r
    })

    console.log('\t Test generator')
    console.log({ ratio: sum / effective_passes })

    return sum / effective_passes
}


const run_tests = (tests_count) => {
    const history = []    

    let mwc = null
    let candidate = { modulus :0, ratio: 1, first_crash: MAX_ITERATIONS }
    let modulus = 0
    let test = {}

    for(tc = 0; tc < tests_count; tc++) {
        console.log('# TEST_COUNT: ' + tc)
        modulus = random_modulus(DIVIDER, SIZE)
        mwc = kesako.create_mwc(modulus, DIVIDER, SIZE)
        console.log('## TEST GENERATOR: modulus = ' + modulus)
        test = { mwc }
        results = test_generator(test, candidate)
        console.log({ results })

        if(results < candidate.ratio) {
            candidate = { ratio: results, modulus, first_crash: candidate.first_crash }

            history.push(candidate)

            console.log('############')
            console.log('FOUND CANDIDATE')
            console.log({ tc, ratio: results, modulus })
            console.log('############')
        }

        console.log('\n\n')
    }

    console.log('# end tests')
    console.log(history)

    console.log(candidate)
    
}

run_tests(TESTS_COUNT)

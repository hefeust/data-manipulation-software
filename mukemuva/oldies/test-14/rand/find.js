
const kesako = require('../../dist')

const TESTS_COUNT = 256
const TEST_PASSES = 16

let max_iterations = 1000000

const DIVIDER = 36
const SIZE = 4

const random_modulus = (divider, size) => {
    const coeffs = []
    let m = 0    
    let x = 0
    let signum = 1

    for(let s = 0; s < size; s++) {
        signum = (s === 0) ? 1 : (Math.random() > 0.5 ? 1 : -1)
        x = Math.floor(divider * Math.random()) * signum        


        coeffs.push(x)
    }

    for(let w = 0; w < size; w++) {
        m += m * divider + coeffs[w]
    }

    return m

}

const test_loop = (mwc, seeds) => {
//     console.log('### TEST LOOP')

    const lookup = new Map()
    let collisions = 0
    let key = null
    let counter = 0

//    max_iterations = 1000
    mwc.init(seeds)

    for(tl =0; tl < max_iterations; tl++) {
        key = kesako.keys36(mwc.next())
    
        counter = lookup.get(key) || 0

        lookup.set(key, 1 + counter)

        if(counter > 1) {
            collisions++
        }
    }    

//    console.log({ ratio: collisions / max_iterations  })

    return collisions / max_iterations
}

const random_seeds = (divider, size) => {
    const seeds = []

    for(let s = 0; s < size; s++) {
        seeds[s] = Math.floor(Math.random() * divider)
    }

    return seeds
}

const test_generator = (mwc) => {
    let result = 0

    let seeds = []

    for(let tp = 0; tp < TEST_PASSES; tp++) {
        seeds = random_seeds(DIVIDER, SIZE)

//        console.log(seeds)

        // results.push(test_loop(mwc, seeds))
        result += test_loop(mwc, seeds)
    }

//    console.log(results)
//    console.log({ ratio: collisions / max_iterations  })
    console.log({ ratio: result / TEST_PASSES  })

    return result / TEST_PASSES
}


const run_tests = (tests_count) => {
    const history = []    
    let mwc = null
    let candidate = { modulus :0, ratio: 1 }
    
    
    let modulus = 0

    for(tc = 0; tc < tests_count; tc++) {
        console.log('# TEST_COUNT: ' + tc)

        modulus = random_modulus(DIVIDER, SIZE)
        mwc = kesako.create_mwc(modulus, DIVIDER, SIZE)

        console.log('## TEST GENERATOR: modulus = ' + modulus)

        results = test_generator(mwc)

        console.log({ results })

        if(results < candidate.ratio) {
            candidate = { ratio: results, modulus }

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

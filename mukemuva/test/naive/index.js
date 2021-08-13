
import { make_pairs } from './make-pairs.js'
import { show_results } from './show-results.js'
import { test } from './test.js'

import { 
    make_naivestore,
    make_bagstore
} from '../../src'

const NMAX = 250 * 1000
const DIMS = new Map()
const KEYNAMES = 'x,y,z,t'.split(',')
const SAMPLING = 25 * 1000
const PICKING = 1 * 1000

DIMS.set('x', 1 * 1000)
DIMS.set('y', 1 * 1000)
DIMS.set('z', 1 * 1000)
DIMS.set('t', 1 * 1000)


const pairs = make_pairs({
    NMAX, DIMS, keynames: KEYNAMES
})

const suites = [
    {
        name: 'TEST SLOW: naive store',
        store: make_naivestore(KEYNAMES, {
        
        }),
        NMAX,
        KEYNAMES,
        DIMS,
        pairs,
        SAMPLING,
        PICKING
    }
]

const do_tests = (async () => {
    const resultsets = await suites.map(async (params) => {
        const results = await test(params)
        console.log(params.store.get_stats())
        return results
    })

//    console.log(await Promise.all(resultsets))

    show_results(suites[0], await Promise.all(resultsets))
}) ()



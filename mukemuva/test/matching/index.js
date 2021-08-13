
import { make_pairs } from './make-pairs.js'
import { merge_results } from './merge-results.js'
import { test} from './test.js'

import { 
    make_naivestore,
    make_bagstore
} from '../../src'

const NMAX = 110 * 1000
const KEYNAMES = ['x', 'y', 'z']
const SAMPLING = 5 * 1000
const PICKING = 1 * 1000

const pairs = make_pairs({
    NMAX, keynames: KEYNAMES
})

const suites = [
    {
        name: 'TEST SLOW: naive store',
        store: make_naivestore(KEYNAMES, {
        
        }),
        KEYNAMES,
        NMAX,
        pairs,
        SAMPLING,
        PICKING
    },     {
        name: 'TEST FAST: bag store',
        store: make_bagstore(KEYNAMES, {
        
        }),
        NMAX,
        KEYNAMES,
        pairs,
        SAMPLING,
        PICKING
    }
]

const do_tests = (async () => {
    const resultsets = await suites.map(async (params) => {
        return await test(params)
    })

//    console.log(await Promise.all(resultsets))

    merge_results(suites[0], await Promise.all(resultsets))
}) ()



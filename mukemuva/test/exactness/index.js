
import { make_bagstore } from '../../src/index.js'
import { pairs_maker } from './pairs-maker.js'
import { test } from './test.js'
import { show_results } from './show-results.js'

const NMAX = 30 * 1000

const DIMS = new Map()

DIMS.set('x', 1 * 1000)
DIMS.set('y', 1 * 1000)
DIMS.set('z', 1 * 1000)
DIMS.set('t', 1 * 1000)

const STORE = make_bagstore(
    Array.from(DIMS.keys()),
    {
    pool: {
       size: NMAX
    }
})


const params = {
    NMAX,
    DIMS,
    STORE
}

const do_tests = (async () => {

    const pairs = pairs_maker(params)

    const results = await  test(params, pairs)

    show_results(await Promise.all(results))
}) ()



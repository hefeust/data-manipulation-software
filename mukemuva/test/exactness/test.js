
import { stringify_pair } from './stringify-pair.js'

const LOG_SAMPLING = 10 * 1000

export const test = async (params, pairs) => {

    const { NMAX, DIMS, STORE } = params
    const STATS = []

    let last_t = Date.now() / 10000
    let delta_t = 0
    let collisions = 0

    console.log('SETS')

    const sets_promises = await pairs.map(async (pair, index) => {

        if ((index % LOG_SAMPLING) === 0 ) console.log({ SETS: index })

        const uid = await STORE.set(pair.bag, pair.with_data)
        pair.test.uid = uid
        pair.test.counter++
    })

    const sets_resolved = await Promise.all(sets_promises)

    console.log('SELECTS')

    pairs.reverse()

    const results_promises = await pairs.map(async (pair, index) => {
        if ((index % LOG_SAMPLING) === 0 ) console.log({ SELECTS: index })        
        
        const selected = await STORE.select(pair.bag)
        
        for await (const s of selected) {
            const zp = stringify_pair(pair)
            const zs = stringify_pair(s)

          if ((index % LOG_SAMPLING) === 0 ) console.log({ zp, zs })        
            

            if (zp !== zs) {
                console.log(zp)
                console.log(zs)
            }
        }
    })

    const results_resolved = await Promise.all(results_promises)

    return STATS
}

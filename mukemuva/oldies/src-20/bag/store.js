

import { create_bmp } from '../pool/bmp.js'
import { make_logics } from './logics.js'
import { make_pair } from './pair.js'

export const make_bagstore = (keynames, options = {}) => {

    const pool = create_bmp({
        pool: {
            size: 100 * 1000
        }
    })

    const kns = keynames

    const logics = make_logics(kns)

    const allocated = []

//    const lookups = new Map()

    const stats = {
        sets: 0, gets: 0, releases: 0, selects : 0
    }

    const set = async (bag, with_data) => {


        const filtered = logics.collect_uids(bag)
        let pair = null
        let new_uid =  null
        let counter = 0

//        console.log({ filtered })

        for (const uid of filtered) {
            pair = await pool.get_data(uid)
            
            if (pair && pair.test(bag)) {
                pair.set_data(with_data)
            }
            
            counter++
        }

//        console.log(counter)

        if (counter === 0) {
            pair = make_pair(bag).set_data(with_data)

            new_uid = await pool.set_data(pair)
            allocated.push(new_uid)

            kns.map((kn) => {
                const pv = bag[kn]
                const record = logics.find_record({ kn, pv }) 
                    || { kn, pv, uids: [] }

                record.uids.push(new_uid)

                logics.set_record(record)
            })
        }

        stats.sets++
    }

    const get = async (bag, with_data) => {

    }

    const select = async function* (kn_filters, post_filter = '*') {
//        console.log(await  Promise.all( allocated.map(async (a) => await pool.get_data(a))))

        const filtered = logics.collect_uids(kn_filters)

//        console.log({ filtered })

        for (const uid of filtered) {
            const pair = await pool.get_data(uid)

            const bag = pair.bag
            const with_data = pair.payload
            
//            console.log(allocated.indexOf(uid))
//            console.log({ pair })

            if (post_filter === '*') {
                yield { bag, with_data }
            } else if (typeof post_filter === 'function') {
                if (post_filter(pair.bag)) {
                    yield { bag, with_data }
                }
            }
        }

        stats.selects++
    }

    const toString = () => {

    }

    const debug = () => {
        const text = [
            'allocated blocks: ' + allocated.length,
            'checkset: ' + (allocated.length === (new Set(allocated)).size)
        ].join('\n')

        return text
    }



    const get_stats = () => {
        return {
            pool: pool.get_stats(),
            store: stats
        }
    }

    return { 
        set, 
        get, 
        select, 
        toString, 
        debug,
        get_stats
    }
}

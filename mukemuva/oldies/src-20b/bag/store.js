
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
        let active_uid =  null
        let counter = 0

//        console.log({ filtered })

//        if (filtered.length > 0) {
//            console.log('SET-multiple')
//            console.log(filtered)
//        }

        if(filtered.length > 0 && filtered[0].length > 0) {
            active_uid = filtered[0][0]
            pair = await pool.get_data(active_uid)
            
            if (pair && pair.test(bag)) {
                pair.set_data(with_data)
            }
        } else {
//        console.log(counter === 0 ? 'NEW ITEM': 'SET')

//        if (counter === 0) {
            pair = make_pair(bag)
            pair.set_data(with_data)
            active_uid = await pool.set_data(pair)
//            allocated.push(new_uid)

            kns.map((kn) => {
                const pv = bag[kn]
                let record = logics.find_record({ kn, pv }) 

                if(record === null) {
                    record = { kn, pv, uids: [] }
                    logics.set_record(record)
                }

                record.uids.push(active_uid)
            })
        }

        stats.sets++

        return active_uid
    }

    const get = async (bag, with_data) => {

    }

    const select = async function* (kn_filters, post_filter = '*') {
        const filtered = logics.collect_uids(kn_filters)

//        console.log({ filtered })

        for (const uid of filtered) {
            const pair = await pool.get_data(uid)

//            console.log("pair", pair)

            const bag = pair.bag
            const with_data = pair.payload
            const toString = pair.toString

            if (post_filter === '*') {
                yield { bag, with_data, toString }
            } else if (typeof post_filter === 'function') {
                if (post_filter(pair.bag)) {
                    yield { bag, with_data, toString }
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

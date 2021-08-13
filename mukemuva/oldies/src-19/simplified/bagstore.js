
import { merge } from '../utils/merge.js'
import { create_bmp } from '../pool/bmp.js'
import { make_logics } from './logics.js'

export const make_bagstore = (keynames, options = {}) => {

    let set_idx = 0

    const set = async (bag, payload) => {
        const inst_keyns = await logics.install_keynames(keynames)
        const inst_parts = await logics.install_parts(bag)
        const inst_items = await logics.install_items(bag, payload)

        stats.sets++

//        if((set_idx % 1000) === 0) {
//            console.log(context.pool.get_stats())
//        }
    }

    const get = async (bag) => {

    }

    const select = async function* (kns_filters = {}, post_filter = '*') {
        const pairs = await logics.select_pairs(kns_filters, post_filter)

        for (const pair of pairs) {
            yield pair
        }
    }

    const remove= async (bag) => {

    }

    const toString = () => {

    }

    const debug = () => {

    }

    const get_stats = () => {
        const { pool, stats } = context

        return {
            pool: pool.get_stats(),
            bagstore: stats
        }
    }

    const trace = async (filters) => {

    }

    const conf = {}

    const tooling = {}

    const logics = {}

    const stats = {
        sets: 0, gets: 0, relases:0, selects: 0
    }

    const context = {}

    const setup = () => {
        context.stats = stats
        context.logics = logics

        context.pool = {}
        context.boot_uid = null  

        merge(context.pool, create_bmp({
            pool: { size: 1000 * 1000 }
        }))

        merge(logics, make_logics(context))
    }


    
    setup()

    return {
        set, 
        get, 
        select, 
        toString, 
        debug, 
        get_stats,
        remove,
        trace
    }
}

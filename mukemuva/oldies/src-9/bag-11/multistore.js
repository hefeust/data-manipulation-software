
import { merge } from '../utils/merge.js'
import { create_bmp } from '../pool/bmp.js'
import { duck_blocks } from './duck_blocks.js'

const defaults = {
    pool: {
        size: 5 * 1000
    }
}

export const create_multistore = (roles_names, options) => {

    const set = async (keys_bag, with_data) => {
        
    }

    const select = async (filters) => {

    }

    const toString = () => {}

    const debug = () => {}

    const setup = () => {
        merge(conf, defaults, options)

        merge(stats, {
            sets: 0, gets: 0, selects: 0, releases: 0
        })

        merge(pool, create_bmp(conf))

//        merge(ctx_lookup, duck_lookup(ctx))
    }


    const conf = {}
    const stats = {}
    const pool = {}
    const ducks = duck_blocks(pool)
    const ctx = { ducks }
    

    setup()

    return {
        set,
        select,
        toString,
        debug
    }
}

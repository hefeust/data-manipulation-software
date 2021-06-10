    
import { merge } from '../utils/merge.js'
import { create_bmp } from '../pool/bmp.js'
import { duck_lookup } from './duck_lookup.js'

const defaults = {
    pool: {
        size: 5 * 1000
    }
}

export const create_multistore = (roles_names, options = defaults) => {

    const set = async (bag, with_data) => {
        console.log('')

        const keys = Object.keys(bag)

        const installed = await lookup.install_roles(roles_names)

        const roles = await keys.map( async (key) => {
            const role = await  lookup.get_role(key)

            console.log('set: map + async', { key, role })

            return  role
        })

        console.log({ installed })
        console.log({ roles })
        console.log(lookup.debug())
    }



    const get = async (bag) => {}

    const select = async function* (filters) {
        console.log('multistore#select', filters)
    }

    const toString = () => {}

    const get_stats = () => {}

    const debug = async () => {}


    const conf = {}
    const stats = {}
    const pool = {}
    const lookup = {}

    const setup = () => {
        merge(conf, defaults, options)
//        console.log({ conf })

        merge(stats, {
            sets: 0, gets: 0, selects: 0
        })
//        console.log('bmp', create_bmp(conf))

        merge(pool, create_bmp(conf))
//        console.log('***',  bmp )


        merge(lookup, duck_lookup(pool))
    }

    setup()

    return {
        set, get, select, toString, get_stats, debug
    }
}


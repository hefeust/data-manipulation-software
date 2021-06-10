    
import { merge } from '../utils/merge.js'
import { create_bmp } from '../pool/bmp.js'
import { duck_lookup } from './duck_lookup.js'
import { uids_collector } from './data_collector.js'

const defaults = {
    pool: {
        size: 5 * 1000
    }
}

export const create_multistore = (roles_names, options = defaults) => {

    const set = async (bag, with_data) => {
        const collector = uids_collector(roles_names)
        const installed = await lookup.install_roles(roles_names)

        const keys = Object.keys(bag)

        await Promise.all(installed)

        console.log('installed:', { installed })

        const roles =  keys.map( async (key) => {
            const role = await lookup.get_role(key)
            const part = await role.set_part(bag[key])
            
            part.set_item({
                collector, 
                role_name: key , 
                with_data 
            })

            return  role
        })

        console.log('collected:', collector.intersect_uids())

        console.log('### SET')
//        console.log(await Promise.all(roles))
    }



    const get = async (bag) => {}

    const select = async function* (filters) {
        console.log('multistore#select', filters)

        console.log('### DEBUG:', lookup.debug())
    }

    const toString = () => {}

    const get_stats = () => {}

    const debug = async () => {}


    const conf = {}
    const stats = {}
    const pool = {}
    const lookup = {}
    const ctx = { pool }

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


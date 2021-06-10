    
import { merge } from '../utils/merge.js'
import { create_bmp } from '../pool/bmp.js'
import { duck_lookup } from './duck_lookup.js'
import { uids_collector } from './uids_collector.js'

const defaults = {
    pool: {
        size: 5 * 1000
    }
}

export const create_multistore = (roles_names, options = defaults) => {

    const set = async (bag, with_data) => {
        const collector = uids_collector(roles_names)
        const ctx = { pool, collector }
        const ctx_lookup = duck_lookup(ctx)
        const installed = await ctx_lookup.install_roles(roles_names)

        // const roles = duck_roles(ctx)
        // const parts = duck_parts(ctx)

        roles_names.map(async (role_name) => {
            const role = await ctx_lookup.get_role(role_name)

            const part = await role.atomic_set(bag[role_name])
//            const uid = part.atomic_set(bag[role_name]).save(with_data)

//            const role = roles.atomic_set(role_name).save(bag[role_name])
//            const uid = parts.atomic_set(bag[role_name], with_data)

            console.log('set' + part )
            console.log('multistore.set: ' + role )
        })

        console.log(ctx_lookup.debug())
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


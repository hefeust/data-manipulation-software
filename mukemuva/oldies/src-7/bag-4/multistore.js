    
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

        const collected_parts = roles_names.map(async (role_name) => {
            const role = await ctx_lookup.get_role(role_name)            
            const part = await role.atomic_set(bag[role_name])

//            console.log('MAP1', part)
            const length = await collector.collect(role_name, part.select_items())

            return part
        })
        
        const delayed = await Promise.all(collected_parts)

        const isect = await collector.intersect()
//        console.log('###', await Promise.all(collected_parts))
        console.log('set collected parts', collected_parts )

        if(isect.length === 0) {
            const setted = await isect.map(async (part) => {
                console.log('MAP2', part)

                return await part.set_item(with_data)
            })
        }

        if(isect.length === 1) {
            const item = await pool.get_data(isect[0])

            block.data = with_data
        }

        console.log(pool.get_stats())
    }



    const get = async (bag) => {}

    const select = async function* (filters) {
        const collector = uids_collector(roles_names)
        const ctx = { pool, collector }
        const ctx_lookup = duck_lookup(ctx)
        const installed = await ctx_lookup.install_roles(roles_names)

//        console.log(pool.debug())

        const counted = roles_names.map(async (role_name) => {
            const role = await ctx_lookup.get_role(role_name)            
            const parts = await role.select_parts(filters[role_name])

            parts.map(async (part) => {
                const uids = await collector.collect(role_name, part.select_items)
            })

            return parts.length
        })

//        console.log(await Promise.all(counted))
        
        const isect = await collector.intersect()

        console.log('multistore#select', filters)

        console.log('SELECT STATS', pool.get_stats())

        for (const uid of await isect) {
            const item = await pool.get_data(uid)
            
            yield item.data
        }
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


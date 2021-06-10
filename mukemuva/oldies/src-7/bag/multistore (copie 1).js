    
import { merge } from '../utils/merge.js'
import { create_bmp } from '../pool/bmp.js'
import { duck_lookup } from './duck_lookup.js'
import { uids_collector } from './uids_collector.js'
import { duck_parts } from './duck_parts.js'

const defaults = {
    pool: {
        size: 5 * 1000
    }
}

export const create_multistore = (roles_names, options = defaults) => {

    const set = async (bag, with_data) => {
        const collector = uids_collector(roles_names)
//        const ctx = { pool, collector }
//        const ctx_lookup = duck_lookup(ctx)
        const parts = duck_parts(ctx)
        
        const installed = await ctx_lookup.install_roles(roles_names)

        console.log({ installed })

        const coll = installed.map(async (promised) => {
            console.log({ promised })
            const { role_name, uid } = await promised 
            const role = await ctx_lookup.get_role(role_name)                        
            const parts = await role.select_parts(bag[role_name])
            const resolved = await Promise.all(parts)
            let part_uid

            if(resolved.length === 0) {
                part_uid = await role.set_part(bag[role_name])
            } 

            if(resolved.length === 1) {
                part_uid = resolved[0]
            } 

            return part_uid
        })

        const isect = await collector.intersect()

          console.log('isect', { isect })

        if(isect.length === 0) {
            const delayed = await Promise.all(coll)
            
            console.log({ delayed })

            const setted = await delayed.map(async (uid) => {
                // console.log({ uid })

                const duck = await parts.hydrate(uid)
                const part = parts.wrap(duck)

                const uidi = await part.set_item(with_data)

                return uidi
            })

            const next = await Promise.all(setted)
        } else  if(isect.length === 1) {
            const item = await pool.get_data(isect[0])

            block.data = with_data
        }

        console.log('SET STATS', pool.get_stats())
    }

    const get = async (bag) => {}


    const select = async function* (filters) {
        const collector = uids_collector(roles_names)
        const ctx = { pool, collector }
//        const ctx_lookup = duck_lookup(ctx)
        const parts = duck_parts(ctx)
        
        const installed = await ctx_lookup.install_roles(roles_names)
        console.log('SELECT', { installed })

        const coll = await roles_names.map(async (role_name) => {
            const role = await ctx_lookup.get_role(role_name)                        
            const uids = await role.select_parts(filters[role_name])
            const resolved = await Promise.all(uids)
            
            console.log({ uids })

            const abc = resolved.map(async (uids) => {
                const def = await collector.collect(role_name, uids)

            console.log('************')

                return def
            })

            return await Promise.all(abc)
        })

        const all = await Promise.all(coll)
        const isect = await collector.intersect()

        console.log('multistore#select', filters)
        console.log({ select: isect })
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
    const ctx = { pool }
    const ctx_lookup = {}

    const setup = () => {
        merge(conf, defaults, options)
//        console.log({ conf })

        merge(stats, {
            sets: 0, gets: 0, selects: 0
        })
//        console.log('bmp', create_bmp(conf))

        merge(pool, create_bmp(conf))
//        console.log('***',  bmp )


        merge(ctx_lookup, duck_lookup(ctx))
    }

    setup()

    return {
        set, get, select, toString, get_stats, debug
    }
}


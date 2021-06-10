    
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


    const collect = async (bag) => {
        const collector = uids_collector(roles_names)
        
        const temp = await ctx_lookup.install_roles(roles_names)
//        console.log({ temp })

        const coll = await roles_names.map(async (role_name) => {
            const role = await ctx_lookup.get_role(role_name)                        
            const owned_parts = await role.select_parts(bag[role_name])

            if(owned_parts.length === 0) {
                owned_parts[0] = await role.set_part(bag[role_name])
            }
            // console.log({ owned_parts })
            owned_parts.map(async(uid) => {
                const duck = await parts.hydrate(uid)
                const part = parts.wrap(duck)

                const count = await collector.collect(role_name, part.select_items())
            })

            return owned_parts
        })

        const isect = await collector.intersect()

        return { coll, isect }
    }

    const set = async (bag, with_data) => {
        const { coll, isect } = await collect(bag)
//        console.log('***** isect',  isect )
//        console.log('***** coll',  coll )

        if (isect.length === 0) {
            console.log('NEW ITEM')
            const resolved = await Promise.all(coll)

            // console.log({ resolved })
            const item_uids = resolved.map(async (uids) => {
                uids.map(async(uid  ) => {
                    // console.log({ isect0map: uid })
                    const duck = await parts.hydrate(uid)
                    const part = parts.wrap(duck)
                    const item_uid = await part.set_item(with_data)

                    return item_uid

                })
            })
        }

        if(isect.length === 1) {
//            console.log('### ALTER ITEM')
            isect.map( async (uid) => {
                const block = await pool.get_data(uid)

                block.data = with_data
            })
        }
    }

    const get = async (bag) => {}


    const select = async function* (filters) {

        const { coll, isect } = await collect(filters)

        console.log('multistore#select', filters)
        console.log('***** isect',  isect )
//        console.log('***** coll',  coll )
//        console.log({ select: isect })
//        console.log('SELECT STATS', pool.get_stats())

        for (const uid of await isect) {
            const item = await pool.get_data(uid)
            
            yield item.data
        }

    }


    const toString = () => {}

    const get_stats = () => {}

    const debug = async () => {
        return pool.debug()
    }


    const conf = {}
    const stats = {}
    const pool = {}
    const ctx = { pool }
    const parts = duck_parts(ctx)
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


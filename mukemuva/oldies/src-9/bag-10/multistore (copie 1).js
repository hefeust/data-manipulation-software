    
import { merge } from '../utils/merge.js'
import { create_bmp } from '../pool/bmp.js'
import { duck_lookup } from './duck_lookup.js'
import { uids_collector } from './uids_collector.js'
import { uids_selector } from './uids_selector.js'
import { duck_roles } from './duck_roles.js'
import { duck_parts } from './duck_parts.js'
import { duck_items } from './duck_items.js'

const defaults = {
    pool: {
        size: 5 * 1000
    }
}

export const create_multistore = (roles_names, options = defaults) => {

    const collect = async (bag) => {
        const collector = uids_collector(roles_names)
        const promises = await ctx_lookup.install_roles(roles_names)
        const installed = await Promise.all(promises)
        const coll = []
        const delayed = await roles_names.map(async (role_name) => {
            const role = await ctx_lookup.get_role(role_name)                        
            const owned_parts = await role.select_parts(bag[role_name])
//            console.log(owned_parts.length  )
            if(owned_parts.length === 0) {
                const part_uid =  await role.set_part(bag[role_name])
                collector.collect(role_name, [part_uid])
                coll.push([part_uid])
            } else {
                const parts_uids = await owned_parts.map(async(uid) => {
                    const duck = await parts.hydrate(uid)
                    const part = parts.wrap(duck)
                    collector.collect(role_name, await part.select_items())
                    return uid
                })
                coll.push(await Promise.all(parts_uids))
            }
//            console.log({ parts_uids: await Promise.all(parts_uids) })
        })
        const resolved = await Promise.all(delayed)
        const isect = collector.intersect()
//        console.log({ coll, isect })
        return { coll, isect }
    }

    const set = async (bag, with_data) => {
        const { coll, isect } = await collect(bag)

        const temp = await Promise.all(isect)

        // console.log('***********')
        // console.log(temp.join(' '))
        //  console.log('***********')

        if (isect.length === 0) {
//            console.log('NEW ITEM')
//            const resolved = await Promise.all(coll)

//            console.log({ coll })

            // flatten array
            // and then reduce promises
            coll.flat().reduce(async (acc, uid) => {
                const duck = await parts.hydrate(uid)
                const part = parts.wrap(duck)
                let item_uid = await acc

                if(item_uid === null) {
                    item_uid = await part.add_item(with_data)
                    // console.log('ADD_ITEM: ', item_uid)
                } else {
                    part.set_item(item_uid)
                    // console.log('SET_ITEM: ', item_uid)
                }
                return item_uid
            }, Promise.resolve(null))
        }

        if(isect.length === 1) {
//            console.log('### ALTER ITEM')
            isect.map( async (uid) => {
                const block = await items.hydrate(uid)

                block.with_data = with_data
            })
        }
    }

      const get = async (bag) => {}


    const select = async function* (filters) {
        const { coll, isect } = await collect(filters)
        const temp = await Promise.all(isect)

//        console.log('multistore#select', filters)
//        console.log('*** select isect',  isect )

//        console.log('***********')
//        console.log(temp.join(' '))
//        console.log('***********')

        for (const uid of await isect) {
            const item = await items.hydrate(uid)
            
            yield item.with_data
        }

    }


    const toString = () => {}

    const get_stats = () => {
        return pool.get_stats()

    }

    const debug = async () => {
        return pool.debug()
    }

    const conf = {}
    const stats = {}
    const pool = {}
    const ctx = { pool }
    const roles = duck_roles(ctx)
    const parts = duck_parts(ctx)
    const items = duck_items(ctx)
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


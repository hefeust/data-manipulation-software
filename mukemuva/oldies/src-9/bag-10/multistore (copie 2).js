    
import { merge } from '../utils/merge.js'
import { create_bmp } from '../pool/bmp.js'
import { duck_lookup } from './duck_lookup.js'
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

    const set = async (bag, with_data) => {
        const selector = uids_selector(roles_names)
        const roles_promises = await ctx_lookup.install_roles(roles_names)
        const roles_resolved = await Promise.all(roles_promises)

        const bag_promises = await roles_names.reduce(async (acc, role_name) => {
            const role = await ctx_lookup.get_role(role_name)                        
            const owned = await role.select_parts(bag[role_name])
            let item_uid = await acc

            if(owned.length === 0) {
                const part_uid =  await role.set_part(bag[role_name])   
                const block = await parts.hydrate(part_uid)
                const part = parts.wrap(block)


                if(item_uid === null) {
//                    console.log({ SAVE:  item_uid })
                    item_uid = await part.add_item(with_data)
                } else {
//                    console.log({ EDIT:  item_uid })
                    part.set_item(item_uid)
                }

//               selector.collect(role.block.uid, part_uid, [item_uid ])
            } else {
//                console.log('ALTERING EXISTING ITEM')
                const promises = owned.map(async (part_uid) => {
                    const block = await parts.hydrate(part_uid)
                    const part = parts.wrap(block)
                    const items_uids = await part.select_items()

                    selector.collect(role.block.uid, part_uid, items_uids)
                })
                
                const resolved = await Promise.all(promises)
            }

            return item_uid
        }, Promise.resolve(null))

//        const bag_resolved = await Promise.all(bag_promises)
        const bags_resolved = await bag_promises

//        console.log(selector.debug())

        const collected = selector.get_collected()

//        console.log({ SET: i  })
//        console.log('selector.get_collected', selector.get_collected().length)

        for (const assoc of collected) {
                const block = await items.hydrate(assoc.item_uid)
                                
//                console.log({ with_data })
                block.with_data = with_data

                break
            }
    }

      const get = async (bag) => {}


    const select = async function* (filters) {
        const selector = uids_selector(roles_names)
        const roles_promises = await ctx_lookup.install_roles(roles_names)
        const roles_resolved = await Promise.all(roles_promises)

        const bag_promises = await roles_names.map(async (role_name) => {
            const role = await ctx_lookup.get_role(role_name)                        
            const owned = await role.select_parts(filters[role_name])
            
            console.log('select_owned', owned.length)

            const owned_promises = owned.map(async (part_uid) => {
                const block = await parts.hydrate(part_uid)
                const part = parts.wrap(block)
                const items_uids = await part.select_items()

                selector.collect(role.block.uid, part_uid, items_uids)
            })

            const owned_resolved = await Promise.all(owned_promises)

            return role_name
        })

        const bag_resolved = await Promise.all(bag_promises)

//        console.   log('select')
        const collected = selector.get_collected()

        console.log('************************', selector.debug())
    }


    const toString = () => {}

    const get_stats = () => {
        return pool.get_stats()

    }

    const debug = () => {
        const data = pool.debug()

        const results = data.map(d => {
            if(d) {
                return `${d.uid}\t${d.duck_type}`
            } else {
                return '#EMPTY!'
            }
        })

        return results.join('\n')
//        return data
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


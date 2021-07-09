
import { merge } from '../utils/merge.js'
import { create_bmp } from '../pool/bmp.js'
import { create_roles_lookup } from './roles-lookup.js'
import { duck_blocks } from './duck-blocks.js'
import { uids_selector } from './uids-selector.js'

const defaults = {
    debug: true,
    pool: {
        size: 1000
    }
}

export const create_multistore = (roles_names, options) => {

    const selector = uids_selector(roles_names)

    let idx = 0
    let collect_idx = 0


    const set = async (pairs_bag, with_data) => {
        const inst_roles = await roles_lookup.install_roles(roles_names)
        const inst_parts = await install_parts(pairs_bag)
        const collected_records = await collect_uids(pairs_bag)

        let counter = 0

//        collect_idx++

        for await (const record of collected_records) {
//            console.log({ RECORD: record }) 
            if (record.length === roles_names.length) {
                const item_uid = record[0].item_uid

                const item = await ducks.hydrate({
                    ducktype: 'item', uid: item_uid
                })

//                console.log({ item })

                const promise = item.set_data(with_data) 

                return await promise
            }

            counter++
        }

        if(counter === 0) {
//            console.log('NEW_ITEM')
//            console.log({ SET_INST_PARTS: inst_parts.length})
            let item
            let index = 0 

            for (const part of inst_parts) {
//                console.log('PART', { part })

                if (index === 0) {
                    item = await part.setup_item( with_data) 
                } else {
                    part.refer_item(item.uid)
                }

//                console.log(item)

                index++
            }
        }

        stats.sets++

//        console.log({ SET_COUNTER: stats.sets }, '\n')

    }

    const install_parts = async (pairs_bag) => {
        const pair_keys = Object.keys(pairs_bag)
//        let counter = 0

        const installed = roles_names.reduce(async (acc, role_name) => {
            const role = await roles_lookup.get_role(role_name)
            let values = await acc
            let part

            if (role_name in pairs_bag) {
                const parts = await role.select_parts(pairs_bag[role_name])                
                
                part = await role.install_part(pairs_bag[role_name])

                values.push(part)
            } else {
                throw new Error('Undefined role in bag: ' + role_name)    
            }
            
            return values
        }, Promise.resolve([]))

//        console.log({ INSTALLED: await installed })

        if ((await installed).length !== roles_names.length) {
            throw new Error ('bad roles pairs count !')
        }

//        return await Promise.all(installed)
        return await installed
    }

    const collect_uids = async (filters) => {
//        const selector = uids_selector(roles_names)       
        let counter = 0

        collect_idx++

        for (const key of roles_names) {
            const role = await roles_lookup.get_role(key)
            const parts = await role.select_parts(filters[key])

            for (const part of parts) {
                const items = await part.select_items()

                for await (const item of items) {
                    selector.collect({
                        collect_idx,
                        role_uid: role.uid, 
                        part_uid: part.uid, 
                        item_uid: item.uid
                    })

                    counter++
                }
            }
        }     
        
//        console.log('COLLECT', { counter })

        return selector.get_collected()
    }

    const get = async (pairs_bag) => {

        stats.gets++
        console.log('GET', { pairs_bag })            
    }

    const select = async function* (filters_bag) {
        const collected_records = await collect_uids(filters_bag)
        let counter = 0

//        collect_idx++

        for await (const record of collected_records) {
            const bag = {}
            let data 

//            if (record.length !== roles_names.length)

            for (const entry of record) {
                const { role_uid, part_uid, item_uid } = entry
                const role = await ducks.hydrate({ ducktype: 'role', uid: role_uid })
                const part = await ducks.hydrate({ ducktype: 'part', uid: part_uid })
                const item = await ducks.hydrate({ ducktype: 'item', uid: item_uid })

             // console.log(role.get_role_name(), part.get_part_value())

                bag[role.get_role_name()] = part.get_part_value()
                data = await item.get_data()
            }

            yield { pairs_bag: bag, with_data: data }
        }

        stats.selects++
    }

    const debug = () => {

        const values = pool.debug().map((d) => {
            if (!d) {
                return { uid: d.uid, data: '#EMPTY!' }
            } else {

                return { uid: d.uid, data: d.data ? d.data.data : '#NULL!' }
            }
        })

        return values
    }


    const toString = () => {

    }

    const get_stats = () => {
        return {
            multistore: stats,
            pool: pool.get_stats()
        }
    }

    const trace = (bag) => {
        const keys = Object.keys(bag)

        for (const key of keys) {
            console.log({ key })
        
        }
    }

    const setup = () => {
        merge(conf, defaults, options)

        merge(stats, {
            sets: 0,
            gets: 0,
            selects: 0,
            relases: 0
        })

        merge(context.pool, create_bmp(conf))
        merge(context.ducks, duck_blocks(context))
        merge(context.roles_lookup, create_roles_lookup(context))  

        // console.log(context)
    }

    const conf = {}
    const stats = {}
    const keygen = {}
    const pool = {}
    const ducks = {}
    const roles_lookup = {}
    const context = { pool, ducks, roles_lookup, debug }

    setup()

    return {
        set,
        get,
        select,
        toString,
        debug,
        trace, 
        get_stats
    }
}

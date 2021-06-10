
import { merge } from '../utils/merge.js'
import { create_bmp } from '../pool/bmp.js'
import { create_roles_lookup } from './roles-lookup.js'
import { duck_blocks } from './duck-blocks.js'
import { uids_selector } from './uids-selector.js'

const defaults = {
    pool: {
        size: 1000
    }
}

export const create_multistore = (roles_names, options) => {

    let idx = 0

    const set = async (pairs_bag, with_data) => {
        const inst_roles = await roles_lookup.install_roles(roles_names)
        const inst_parts = await install_parts(pairs_bag)
        const collected_records = await collect_uids(pairs_bag)
        let counter = 0

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

//        console.log({ SET_COUNTER: counter })

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
                
//                if (parts.length === 0)  {
                    part = await role.install_part(pairs_bag[role_name])
//                }

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
//        console.log('***** COLLECT UIDS *****')

        const selector = uids_selector(roles_names)       
        let counter = 0
        let nested = 0

        for (const key of roles_names) {
            const role = await roles_lookup.get_role(key)
            const parts = await role.select_parts(filters[key])

            for (const part of parts) {
//                console.log({ part: part.uid })

                const items = await part.select_items()

                for await (const item of items) {
                    selector.collect({
                        role_uid: role.uid, 
                        part_uid: part.uid, 
                        item_uid: item.uid
                    })

                    nested++
                }

                counter++   
            }
            
        }     
        
//        console.log('SELECTOR', selector.debug())

            console.log('COLLECT', { counter, nested })
        return selector.get_collected()
    }

    const get = async (pairs_bag) => {

        stats.gets++
        console.log('GET', { pairs_bag })            
    }

    const select = async function* (filters_bag) {
        const collected_records = await collect_uids(filters_bag)
        let counter = 0

        for await (const record of collected_records) {
            const bag = {}
            let data 
//            console.log({ RECORD: record }) 

            for(const entry of record) {
                const { role_uid, part_uid, item_uid } = entry
                const role = await ducks.hydrate({ ducktype: 'role', uid: role_uid })
                const part = await ducks.hydrate({ ducktype: 'part', uid: part_uid })
                const item = await ducks.hydrate({ ducktype: 'item', uid: item_uid })

//                console.log({ role, part, item})

                bag[role.get_role_name()] = part.get_part_value()
                data = await item.get_data()
            }

            yield { pairs_bag: bag, with_data: data }

            counter++
        }

        stats.sets++
        stats.selects++
    }

    const debug = () => {

        const values = pool.debug().map((d) => {
            if (!d) {
                return '#EMPTY!'
            } else {
                return d.data
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

    const keygen = {}
    const pool = {}
    const ducks = {}
    const roles_lookup = {}
    const context = { pool, ducks, roles_lookup }
    const conf = {}
    const stats = {}

    setup()

    return {
        set,
        get,
        select,
        toString,
        debug,
        get_stats
    }
}

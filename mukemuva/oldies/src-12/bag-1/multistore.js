
import { merge } from '../utils/merge.js'
import { create_bmp } from '../pool/bmp.js'
import * as ducktypes from './ducktypes.js'
import { duck_blocks } from './duck-blocks.js'
import { duck_installers } from './duck-installers.js'

const defaults = {
    pool: {
        size: 100,
    },
    debug: true
}

export const create_multistore = (roles_names, options = {}) => {

    const recordToString = async (record) => {
        const results = []

        for(const entry of record) {
            const { role_uid, part_uid, item_uid } = entry

            const role = await ducks.hydrate({ ducktype: 'R', uid: role_uid  })
            const part = await ducks.hydrate({ ducktype: 'P', uid: part_uid  })
            const item = await ducks.hydrate({ ducktype: 'I', uid: item_uid  })

            const lines = [
            'record-entry',
                '    role: ' + role_uid + ' ' + role.role_name,
                '    part: ' + part_uid + ' ' + part.part_value,
                '    item: ' + item_uid,
                ''
            ].join('\n')

            results.push(lines)
        }

        return results.join('\n')
    }
    
    const set = async (bag, with_data) => {
//        console.log('SET')
        const inst_roles = await installers.install_roles(roles_names)
        const inst_parts = await installers.install_parts(bag)
        const collected_records = await installers.collect_uids(bag)
        let item_uid = 0
        let counter = 0

        for await (const record of collected_records) {
//            console.log(await recordToString(record))

            if (record.length === roles_names.length) {
                const item_uid = record[0].item_uid

                const item = await ducks.hydrate({
                    ducktype: ducktypes.DUCKTYPE_ITEM, 
                    uid: item_uid
                })

                const promise = await item.set_data(with_data) 

                counter++
            }
        }

        // NEW ITEM ?
        if(counter === 0) {
            let item
            let index = 0 

            for (const part of inst_parts) {
                if (index === 0) {
                    item = await part.set_item( with_data) 
                } else {
                    part.refer_item(item.uid)
                }

                index++
            }
        }

        stats.sets++
    }
        
    const get = async (bag) => {

    }

    const select = async function* (filters) {
        const collected_records = await installers.collect_uids(filters)
        let counter = 0

//        collect_idx++

        for await (const record of collected_records) {
            const result = {}
            let data 

//            console.log({ record })


            for (const entry of record) {
                const { role_uid, part_uid, item_uid } = entry

                const role = await ducks.hydrate({ 
                    ducktype: ducktypes.DUCKTYPE_ROLE, uid: role_uid 
                })
                const part = await ducks.hydrate({ 
                    ducktype: ducktypes.DUCKTYPE_PART, uid: part_uid 
                })
                const item = await ducks.hydrate({ 
                    ducktype: ducktypes.DUCKTYPE_ITEM, uid: item_uid
                })

//            console.log(role.role_name, part.part_value)
//                console.log(role, part)

                result[role.role_name] = part.part_value
                data = await item.get_data()
            }

            yield { bag: result, with_data: data.with_data }
        }

        stats.selects++
    }

    const toString = () => {
    
    }

    const debug = () => {
    }

    const trace = async (bag) => {

    }

    const get_stats = () => {
        return {
            pool: pool.get_stats(),
            multistore: stats
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
        merge(context.installers, duck_installers(context))  


        console.log('setup', conf)
    }

    const conf = {}
    const stats = {}
    const keygen = {}
    const pool = {}
    const ducks = {}
    const installers = {}

    const context = { 
        keygen, 
        pool, 
        ducks,
        installers,
        debug
    }

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

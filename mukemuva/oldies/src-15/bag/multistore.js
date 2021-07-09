
import { merge } from '../utils/merge.js'
import { create_bmp } from '../pool/bmp.js'
import * as ducktypes from './ducktypes.js'
import { duck_blocks } from './duck-blocks.js'
import { duck_lookup } from './duck-lookup.js'

const defaults = {
    debug: true,
    pool: {
        size: 100000
    }
}

export const create_multistore = (roles_names, options = {}) => {

    const set = async (bag, with_data) => {
        const inst_roles = await tooling.lookup.install_roles(roles_names)
        const inst_parts = await tooling.lookup.install_parts(bag)
        const inst_items = await tooling.lookup.install_item(bag, with_data)

        return inst_items
    }

    const get = async (bag) => {

    }

    const select = async function* (filters) {
        const pairs = await tooling.lookup.select_items(filters)                

        for await (const pair of pairs) {
            yield pair
        }
    }

    const remove= async (bag) => {

    }

    const toString = () => {

    }

    const debug = () => {

    }

    const trace = async (filters) => {

    }

    const get_stats = () => {
        return {
            pool: tooling.pool.get_stats()
        }
    }


    const conf = {}

    const stats = {
        sets: 0,
        gets: 0,
        removes: 0,
        selects: 0
    }

    const tooling = {
        keygen: {},
        pool: {},
        ducks: {},
        lookup: {}
    }

    const context = {
        conf,
        tooling,
        stats
    }

    const setup = () => {
        merge(context.conf, defaults, options)
        merge(tooling.pool, create_bmp(conf))
        merge(tooling.ducks, duck_blocks(context))
        merge(tooling.lookup, duck_lookup(context))
//        console.log('context.conf', context.conf)
//        console.log('context.tooling', context.tooling)
    }
    
    setup()

    return {
        set, 
        get, 
        select, 
        toString, 
        debug, 
        get_stats,
        remove,
        trace
    }
}

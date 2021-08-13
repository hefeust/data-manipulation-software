


import { lists_intersect } from '../utils/lists-intersect.js'
import { cartesian_product } from '../utils/cartesian-product.js'

import { 
    DUCKTYPE_BOOT,
    DUCKTYPE_KEYS,
    DUCKTYPE_PART,
    DUCKTYPE_ITEM,
} from './ducktypes.js'

export const make_logics = (context) => {


    const blocks_cache = new Map()
    const parts_cache = new Map()

    const install_keynames = async (kns) => {
        const { pool } = context
        const kn_lookups = new Map()
        const kn_related = []
        let { boot_uid } = context
//        console.log({ boot_uid })

        if (boot_uid === null) {
            const promises = kns.map(async (kn) => {
                const kn_uid = await pool.set_data({
                    ducktype: DUCKTYPE_KEYS,
                    lookups: new Map(),
                    related: []
                })

                kn_lookups.set(kn, kn_uid)
                kn_related.push(kn_uid)

                const kn_block = await pool.get_data(kn_uid)
                
                blocks_cache.set(kn_uid, kn_block)
            })            
            
            const resolved = await Promise.all(promises)

            boot_uid = await pool.set_data({
                ducktype: DUCKTYPE_BOOT,
                lookups: kn_lookups,
                related: kn_related,
            })          

            const boot_block = await pool.get_data(boot_uid)

            blocks_cache.set(boot_uid, boot_block)
        }

        context.boot_uid = boot_uid

        return boot_uid
    }

    const install_parts = async (bag) => {
        const { pool, boot_uid } = context
//        const boot_block = await pool.get_data(boot_uid)           
        const boot_block = blocks_cache.get(boot_uid)
        const kns = Array.from(boot_block.lookups.keys())

        const promises = kns.map(async (kn) => {
            //const kn_block = await pool.get_data(boot_block.lookups.get(kn) )
            const kn_block = blocks_cache.get(boot_block.lookups.get(kn))

            if(false === bag.hasOwnProperty(kn)) {
                throw new Error('install_parts: missing keyname in bag: ' + kn)
            }

            if(!kn_block) {
                throw new Error('missing block keyname = ' + kn)            
            }

            const part_value = bag[kn]
            let part_uid = kn_block.lookups.get(part_value)

            if (!part_uid) {
                const related = []    
                const lookups = new Map()
                
                part_uid = await pool.set_data({
                    ducktype: DUCKTYPE_PART,
                    lookups, related,
                    payload: { part_value }
                })

                kn_block.lookups.set(part_value, part_uid)
                kn_block.related.push(part_uid)
            }
            
            return part_uid
        })

        const resolved = await Promise.all(promises)

        return resolved
    }

    const install_items = async (bag, payload) => {
        const { pool, boot_uid } = context
        const records = await select_records(bag)
        let record_counter = 0

         for (const record of records) {
            const lists = []

            for(const part_block of record) {
                lists.push( part_block.related)
            }

            const isect = lists_intersect(lists)

            for (const uid of isect) {
                const item = await pool.get_data(uid)

                item.payload = { payload }
                record_counter++
            }
        

        if (record_counter === 0) {
            let index = 0
            let item_uid = null

            for (const part of record ) {
                if (index === 0) {
                        // add new item to parts
                    item_uid = await pool.set_data({
                        ducktype: DUCKTYPE_ITEM,
                        payload: { payload }
                    })
                }

                part.related.push(item_uid)
                part.counter++
                index++

                }
            }
        }
 
        return record_counter
    }

    const select_records = async (filters) => {
        const { pool, boot_uid } = context
        const records = []
//        const boot_block = await pool.get_data(boot_uid)
        const boot_block = blocks_cache.get(boot_uid)
        const kns = Array.from(boot_block.lookups.keys())
        const arrays = []
            let count = 0

        // an attempt to boost partition finding        
//        const cache = new Map()
        
//        const keynames_lookups = new Map()

//        const promises = kns.map(async (kn) => {
//            const kn_uid = boot_block.lookups.get(kn)
//            const kn_block = await pool.get_data(kn_uid)
//
//            keynames_lookups.set(kn, kn_block)            
//        })
//
//        const resolved = await Promise.all(promises)
        
        for (const kn of kns) {
//            const kn_block = keynames_lookups.get(kn)
            const kn_block = blocks_cache.get(boot_block.lookups.get(kn))

            const filter = filters[kn]
            const pvs = Array.from(kn_block.lookups.keys())
            const hits = []
            let filtered = []

            if (kn_block.lookups.has(filter)) {
                filtered = [kn_block.lookups.get(filter)]
            } else if (typeof filter === 'function') {
                filtered = pvs.filter((pv) => filter(pv))
            } else if (filter === '*') {        
                filtered = pvs
            } 

            for (const part_uid of filtered) {
                hits.push(part_uid)
            }

            arrays.push(hits)
        }

        const cart_prod = cartesian_product(...arrays)

        for(const cp of cart_prod) {

            const results = []

            for(const uid of cp) {
                let part

                if(parts_cache.has(uid)) {
                    part = parts_cache.get(uid)
                } else {
                    part = await pool.get_data(uid)
                    
                    parts_cache.set(uid, part)
                }

                results.push(part)
            }

            records.push(results)
        }

        return records
    }

    const select_items = async function* (filters, having) {
        const { pool, boot_uid } = context
        const records = await select_records(filters)

    }

    return {
        install_keynames, 
        install_parts, 
        install_items,
        select_records,
        select_pairs
    }
   
}

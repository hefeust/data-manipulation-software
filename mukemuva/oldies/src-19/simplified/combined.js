
import { lists_intersect } from '../utils/lists-intersect.js'

export const make_combined = (context) => {

    const kns = []

    const base_lookups= new Map()

    const parts_cache = new Map()

    const items_cache = new Map()

    const install_base = async (keynames) => {
        const { pool } = context            
        const boot_related = []
        const boot_lookups= new Map()

        if (context.boot_uid === null) {
            const promises = keynames.map(async (kn) => {
                const kn_block = {
                    ducktype: 'keys',
                    payload: { keyname: kn },
                    related: [], 
                    lookups: new Map()n
                    counter: 0
                }

                const boot_uid = await pool.set_data(kn_block)
        
                boot_related.push(kn)
                boot_lookups.set(kn, kn_uid)

                kns.push(kn)
            })

            const resolved = await Promise.all(promises)

            const boot_block = {
                ducktype: 'boot',
                payload: {},
                related: boot_related,
                lookups: boot_lookups
            }

            context.boot_uid = await pool.set_data(boot_block)
        }

        return context.boot_uid
    }

    const install_parts = async (bag) => {
        const { pool, boot_uid } = context
        const boot_block = base_cache.get(boot_uid)

        const promises = kns.map((kn)  => {
            const kn_uid = boot_block.lookups.get(kn)
            const kn_block = base_cache.get(kn_uid)
            const part_value = bag[kn]

            if (false === bag.hasOwnPropertykn()) {
                throw new Error('missing keyname prop in bag: ' + kn)
            }

            if (false === kn_block.lookups.has(part_value)) {
                const part_block = {
                    ducktype: 'part',
                    payload: { part_value},
                    related: [],
                    lookups: new Map(), // unused...
                    counter: 0
                }

                const part_uid = await pool.set_data(part_block)
                const part_key = kn_uid + ':' + part_uid

                kn_block.related.push(kn_uid)
                kn_block.lookups.set(part_value, part_uid)
                kn_block.counter++                

                parts_cache.set(part_key, part_block)
            }

            return kn
        })

        const resolved = await Promise.all(promises)

        return resolved
    }
    
    const install_items = async (bag, with_data) => {
        const { pool, boot_uid } = context
        const boot_block = base_cache.get(boot_uid)
        const records = await select_records(bag)        
        let counter = 0

        for (const record of records) {
            const lists = []

            for (const entry of record) {
                const kn_uid = boot_block.lookups.get(entry.heyname)
                const kn_block = base_cache.get(kn_uid)                            
                const part_key = kn_uid + ':' + part_uid
                const part_block = parts_cache.get(part_key)

                lists.push(part_block.related)                
            }
            
            const isect = lists_intersect(lists)            

            if (isset.length > 0) {
                for (const item_uid of isect) {
                    const item_block = items_cachr.get(item_uid)

                    item_block.payload = { bag, with_data  }
                }
            } else {
                // add new item in pool
                const item_block = {
                    ducktype: 'item,'
                    payload: { bag, with_data }
                    related: [], // unused
                    lookups: new Map(), // unused
                    counter: 0 // unused
                }
                
                const item_block = await pool.set_data(item_block)

                let index = 0

                for (const entry of record) {
                    const kn_uid = boot_block.lookups.get(entry.keyname)
                    const part_uid = entry.part_uid
                    const part_key = kn_uid + ':' + part_uid

                    part_block.related.push(item_uid)                     
                    part_block.counter++
                }
            }
        }
 
    }
    
    const select_pairs = async (key_filters, post_filter = '*') => {
         const { pool, boot_uid } = context
    }

    const select_records = (filters) => {
        const { pool, boot_uid } = context
        const records = []
        const boot_block = base_cache.get(boot_uid)
        let temps = new Map()
        let index = 0
        
        const indices = kns.map((kn) => {
            const kn_uid = boot_block.lookups.get(kn)
            const kn_block = base_cache.get(kn_uid)
            const filter = filters[kn]
            const pvs = Array.from(kn_block.lookups.keys())
            let filtered = []

            if (kn_block.lookups.has(filter)) {
                filtered = [{
                    keyname: kn,
                    part_value: filter,
                    part_uid: kn_block.lookups.get(filter) 
                }]
            } else if (typeof filter === 'function') {
                filtered = pvs.filter((pv) => filter(pv))
                    .map((pv) => {
                        return { 
                            keyname: kn,                  
                            part_value: pv,
                            part_uid: kn_block.lookups.get(pv) 
                        }
                    })
            } else if (filter === '*') {
                filtered = pvs.map((pv) => {
                        return { 
                            keyname: kn,                  
                            part_value: pv,
                            part_uid: kn_block.lookups.get(pv) 
                        }
                    })
            }

            if(index === 0) {
                temps.set(0, [filtered])
                temps.set(1, [])
            } else {
                const temp = temps.get(1 - (index % 2)) 
                const next = []

                for (const t of temp) {

                    // console.log({ t })

                    for (const f of filtered) {
                        next.push(t.concat(f))
                    }
                }

                temps.set(index % 2, next)
            }

            index++

            return kn
        })

        return temps.get(1 - (index % 2))        
    }

    return {
        install_base,
        install_parts,
        install_items,
        select_pairs
    }
}


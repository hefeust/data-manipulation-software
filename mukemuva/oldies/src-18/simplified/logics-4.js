
import { lists_intersect } from '../utils/lists-intersect.js'

export const make_logics = (context) => {

    const base_cache = new Map()

//    const parts_lookups = new Map()

    const parts_cache = new Map()

//    const parts_cache = new Map()

    const install_keynames = async (keynames) => {
        const { pool } = context
        let { boot_uid } = context

        if (boot_uid === null) {
            const boot_related = []
            const boot_lookups =new Map()

            const promises = keynames.map(async (kn) => {
                const kn_block = {
                    ducktype: 'K',
                    lookups: new Map(),
                    related: [],
                    payload: { keyname: kn },
                    counter: 0
                }

                const kn_uid = await pool.set_data(kn_block)

                base_cache.set(kn_uid, kn_block)
                boot_lookups.set(kn, kn_uid)
                boot_related.push(kn_uid)

                return kn
            })

            const resolved = await Promise.all(promises)

            const boot_block  = {
                ducktype: 'B',
                related: boot_related,
                lookups: boot_lookups,
                counter: 0,
            }

            boot_uid = await pool.set_data(boot_block)
            base_cache.set(boot_uid, boot_block)

            context.boot_uid = boot_uid
        }
    }

    const install_parts = async (bag) => {
        const { pool, boot_uid } = context
        const boot_block = base_cache.get(boot_uid)
        const kns = Array.from(boot_block.lookups.keys())

        const promises = kns.map(async (kn) => {
            const kn_uid = boot_block.lookups.get(kn)
            const kn_block = base_cache.get(kn_uid)

            if (false === bag.hasOwnProperty(kn)) {
                throw new Error('missing keyname in bag; ' + kn)
            }

            const part_value = bag[kn]

            if(false === kn_block.lookups.has(part_value)) {
                const part_block = {
                    ducktype: 'P',
                    related: [],
                    lookups: new Map(),
                    payload: { part_value },
                    counter: 0
                }

                const part_uid = await pool.set_data(part_block)

                kn_block.related.push(kn_uid)
                kn_block.lookups.set(part_value, part_uid)
                kn_block.counter++
            }

            return part_value
        })

        const resolved = await Promise.all(promises)
    }

    const install_items = async (bag, payload) => {
        const { pool, boot_uid } = context
        const boot_block = base_cache.get(boot_uid)
        const kns = Array.from(boot_block.lookups.keys())
//        const parts_cache = new Map()
        const records = select_records(bag)
        let counter = 0

        for (const record of records) {
            const lists = []

            for (const entry of record) {
                const kn_uid = boot_block.lookups.get(entry.heyname)
                const kn_block = base_cache.get(kn_uid)                            
                const part_block = await pool.get_data(entry.part_uid)

                parts_cache.set(entry.part_uid, part_block)
                lists.push(part_block.related)                
            }

//            console.log(lists)

            const isect = lists_intersect(lists)

            if(isect.length > 0) {
                for (const item_uid of isect) {
                    const item_block = await pool.get_data(item_uid)

                    item_block.payload = { payload }
        
                    break
                }
            } else {
            // add new item in pool
                let index = 0
                let item_uid = '#KO!'
                let item_block= null

                for (const entry of record) {
                    const part_block = parts_cache.get(entry.part_uid)

                    if(index === 0) {
                        item_block = {
                            ducktype: 'I',
                            payload: { payload }
                        }

                        item_uid = await pool.set_data(item_block)
                    }
                    

                    part_block.related.push(item_uid)                     
                    part_block.counter++

                    index++
                }
            }
        }

//        console.log(records)
    }

    const select_pairs = async (kns_filters = {}, post_filter = '*') => {
        const { pool, boot_uid } = context
        const boot_block = base_cache.get(boot_uid)
        const kns = Array.from(boot_block.lookups.keys())
        const records = select_records(kns_filters)
        const results = []

        for (const record of records) {
            const bag = {}
            const lists = []
            const parts_cache = new Map()
            let payload = null

            for (const entry of record) {
               const part_block = await pool.get_data(entry.part_uid)

               parts_cache.set(entry.keyname, part_block)
               bag[entry.keyname] = part_block.payload.part_value
               lists.push(part_block.related)

//               console.log(part_block)
            }

            const isect = lists_intersect(lists)

//            console.log(lists)

            for (const item_uid of isect) {
                const item_block = await pool.get_data(item_uid)

                payload = item_block.payload.payload

                if ('*' === post_filter || true === post_filter(bag)) {
                    results.push({ bag, payload })
                } 

                break
            }

        }

        return results
    }

    const select_records = (filters) => {
        const { pool, boot_uid } = context
        const records = []
        const boot_block = base_cache.get(boot_uid)
        const kns = Array.from(boot_block.lookups.keys())
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
        install_keynames,
        install_parts,
        install_items,
        select_pairs
    }
}

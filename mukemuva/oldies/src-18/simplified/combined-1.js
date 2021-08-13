
import { lists_intersect } from '../utils/lists-intersect.js'

export const make_logics = (context) => {

    const base_cache = new Map()

    const records_cache = new Map()

    const install_keynames = async (keynames) => {
        const { pool, boot_uid } = context 
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

                cache_part(kn_uid, part_uid, part_block)
            }

            return part_value
        })

        const resolved = await Promise.all(promises)
    }

    const install_items = async (bag, with_data) => {
        const { pool, boot_uid } = context
        const boot_block = base_cache.get(boot_uid)
//        const kn_cache = new Map()
        const kns = Array.from(boot_block.lookups.keys())
        const parts_cache = new Map()
        const records = select_records(bag)
        let counter = 0

        for (const record of records) {
            const lists = []

            for (const entry of record) {
                const kn_uid = boot_block.lookups.get(entry.heyname)
                const kn_block = base_cache.get(kn_uid)                            

                let part_block = uncache_part(kn_uid, entry.part_uid) 
//                    || await pool.get_data(entry.part_uid)

                parts_cache.set(entry.keyname, part_block)
                lists.push(part_block.related)                
            }

            const isect = lists_intersect(lists)

            for (const item_uid of isect) {
                const item_block = await pool.get_data(item_uid)

                item_block.payload = { payload }

                break
            }

            // add new item in pool
            if(counter === 0) {
                let index = 0

                for (const kn of kns) {
                    const kn_uid = boot_block.lookups.get(kn)
                    const part_block = parts_cache.get(kn_uid)
                    let item_uid, item_block

                    if(index === 0) {
                        item_block = {
                            ducktype: 'I',
                            payload: { bag, payload }
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

    const select_pairs = async (bag, with_data) => {

    }

    const select_records = async (filters) => {
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

//            console.log({ index, filtered })

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

//        const resolved = await Promise.all(promises)

//        console.log('temps:', temps.get(1 - (index % 2)))

        return temps.get(1 - (index % 2))
    }

    const cache_part = (kn_uid, part_uid, part_block) => {
        const part_key = kn_uid + ':' + part_uid 

        parts_cache.set(part_key, part_block)
    }

    const uncache_part = (kn_uid, part_uid, part_block) => {
        const part_key = kn_uid + ':' + part_uid 

        return parts_cache.get(part_key)
    }

    return {
        install_keynames,
        install_parts,
        install_items,
        select_pairs,
    }
}

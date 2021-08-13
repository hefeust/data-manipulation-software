

import { lists_intersect } from '../utils/lists-intersect.js'

import { 
    iterative_cartesian_product 
} from '../utils/iterative-cartesian-product.js'

export const make_logics = (keynames) => {

    const kns = keynames

    const lookups = new Map()

    const set_record = (record) => {
        const { kn, pv, uids } = record
        const entries = lookups.get(pv) || []

        let found = false

        for (const entry of entries) {
            if(entry.kn === kn) {
                found = true
                break
            }
        }

        if (found === false) {
            entries.push(record)
        }

        lookups.set(pv, entries)
    }

    const find_record = (selector) => {
        const { kn, pv } = selector
        const entries = lookups.get(pv) || []
//        const filtered = entries.filter((e) => e.kn === kn)

        for (const entry of entries) {
            if(entry.kn === kn) {
                return entry
            }
        }

        return null
    }

    const filter_records = (selector) => {
        const results = []
        const { kn, pv } = selector
        const pvs = Array.from(lookups.keys())
        let filtered = []

        

        if (pv in pvs) {
            filtered = [pv]
        } else if (typeof pv === 'function') {
            filtered = pvs.filter((value) => pv(value))            
        } else if (Array.isArray(pv)) {
            filtered = pvs.filter((value) => pv.includes(value))
        } else if (pv == '*') {
            filttered =pvs
        } else {
            if(pv.min && pv.max) {
                filtered = pvs.filter((value) => pv.min <= value && value <= pv.max)
            } else if (pv.mean && pv.sd) {
                filtered = pvs.filter((value) => Math.abs(value - pv.mean) <= pv.sd)
            }
        }

        let records = null

        try {
            for(const f_pv of filtered) {

                records = lookups.get(f_pv) || []
    
                for (const record of records) {
                    if (record.kn === kn) {
                        results.push(record)
                    }
                }
            }
        } catch (err) {
            console.log(records)
            console.log(filtered)
            console.log(lookups.get(filtered[0 ]))
            throw err
        }


        // console.log('****', results)

        return results
    }

    const collect_uids = (filters) => {
        const iterapic = iterative_cartesian_product()

        kns.map((kn) => {
            const pv = filters[kn]
            const records = filter_records({ kn, pv })
            
            iterapic.prod_array(records)
        })

        const cartesian = iterapic.results
        let isects = []

//        console.log('cartesian', cartesian)

        cartesian.map((carts) => {
            const lists = carts.map((record) => {
                //  console.log(record)

                return record.uids
            })

            isects.push(...lists_intersect(lists))
        })
        
//        console.log({ isects })

        return isects
    }

    return {
        find_record,
        set_record,
        collect_uids
    }
}
    

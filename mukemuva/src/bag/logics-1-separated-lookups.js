

import { lists_intersect } from '../utils/lists-intersect.js'

import { 
    iterative_cartesian_product 
} from '../utils/iterative-cartesian-product.js'

export const make_logics = (keynames) => {

    const kns = keynames

    const lookup_index = new Map()

    const parts_lookups = []

    kns.map((kn, index) => {
        lookup_index.set(kn, index)
        parts_lookups[index] = new Map()
    })

    const set_record = (record) => {
        const { kn, pv } = record
        const index = lookup_index.get(kn)        
        const lookup = parts_lookups[index]

        lookup.set(pv, record)
    }

    const find_record = (selector) => {
        const { kn, pv } = selector
        const index = lookup_index.get(kn)        
        const lookup = parts_lookups[index]

        return lookup.get(pv) || null
    }

    const filter_records = (selector) => {
        const { kn, pv } = selector
        const index = lookup_index.get(kn)        
        const lookup = parts_lookups[index]
        const results = []
        const pvs = Array.from(lookup.keys())
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
/*
        let records = null
        for(const f_pv of filtered) {
            records = lookups.get(f_pv) || []
            for (const record of records) {
                    if (record.kn === kn) {
                        results.push(record)
                    }
                }
        }
        return results
*/
        return filtered.map((f_pv) => lookup.get(f_pv))
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
                return record.uids
            })

            isects.push(...lists_intersect(lists))
        })

        return isects
    }

    return {
        find_record,
        set_record,
        collect_uids
    }
}
    

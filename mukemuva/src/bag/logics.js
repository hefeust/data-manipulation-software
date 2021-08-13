

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

        if(! record) throw new Error('not a record ! ' + kn + ' ' + pv)

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

        

        if(lookup.has(pv)) {
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
        return filtered.map((f_pv) => {
            const record = lookup.get(f_pv)

            if(! record) console.log({ kn, pv })

            return record
        })
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

//        try {
        cartesian.map((carts) => {
            const lists = carts.map((record) => {
                return record.uids
            })

            isects.push(...lists_intersect(lists))
        })
//        } catch(err) {
//            console.log(cartesian)
//            console.log(filters)
//            throw err
//        }
        return isects
    }

    const find_uid = (bag) => {
        let isect = []

        const records = kns.map((kn) => {
           const pv = bag[kn]
           const record = find_record({ kn, pv }) || { kn, pv, uids: [] }

           return record
        })

        const uids_lists = records.map((record) => record.uids)

        isect = lists_intersect(uids_lists)

        return isect
    }

    return {
        find_record,
        set_record,
        collect_uids,
        find_uid
    }
}
    



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

//        if( entries.filter((e) => e.kn === kn).length === 0) {
//            entries.push(record)
//        }
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

        if (lookups.has(pv)) {
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

        for(const f_pv of filtered) {

            const records = lookups.get(f_pv) 

//            console.log({ filtered } )

            for (const record of records) {
                if (record.kn === kn) {
                    results.push(record)
                }
            }
        }


        // console.log('****', results)

        return results
    }

    const collect_uids = (filters) => {
        const iterapic = iterative_cartesian_product()
        let check = true
//        console.log('\n\n=======')

        kns.map((kn) => {
            const pv = filters[kn]
            const records = filter_records({ kn, pv })
            const uids = []

//            console.log({ kn, pv}, records.length)

            records.map((record) => {
                uids.push(...record.uids)
            })

        

            check = check && (uids.length > 0)            

            iterapic.prod_array(uids)
        })

        const cartesian = iterapic.results
        let isect = []


        cartesian.map((carts) => {
//            console.log({ cartesian: cartesian.length })
//            console.log(cartesian)
//            console.log('carts:', carts)

            const lists = carts.map((uid) => [uid])
            isect = lists_intersect(lists)
        })        
        
//        console.log({ isect })
        return isect
    }

    return {
        find_record,
        set_record,
        collect_uids
    }
}
    

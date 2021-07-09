
import { lists_intersect } from '../utils/lists-intersect.js'

export const uids_intersector = (roles_names) => {

    const lookup = new Map()
    const lists = []

    const collect = (record) => {
        const { item_uid, isect_idx } = record

        const collected = lookup.get(item_uid) || []

        collected.push(record)

        if(lists[isect_idx].indexOf(item_uid) === -1) 
            lists[isect_idx].push(item_uid)

        lookup.set(item_uid, collected)
    }    

    const get_intersected = function* () {
        const isect = lists_intersect(lists)

        for(const item_uid of isect) {
            const records = lookup.get(item_uid)
        
//            console.log({ records })

//            for(const record of records) {
                yield records
//            }
        }
    }

    roles_names.map((role_name, idx) => {
        lists[idx] = []
    })

    return {
        collect,
        get_intersected
    }
}

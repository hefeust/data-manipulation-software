
export const uids_selector = (roles_names) => {
    const lookup = new Map()

    const collect = (role_uid, part_uid, items_uids) => {
//        console.log('uids_selector.collect', items_uids )

        items_uids.map((item_uid) => {
            const assocs = lookup.get(item_uid) || []

            if(assocs.length === 0) {
                assocs.push({
                    role_uid, part_uid, item_uid, counter: 1
                })
            } else {
                for(let i = 0; i < assocs.length; i++) {
//                    if(assocs[i].role_uid !== role_uid) continue
//                    if(assocs[i].part_uid !== part_uid) continue

                    assocs[i].counter++
                }
            }

            lookup.set(item_uid, assocs)

//            console.log('collect:', lookup)
        })
    }

    const get_collected = function () {
//        console.log({ get_collected_lookup: Array.from(lookup.keys()).length })
        const items_uids = Array.from(lookup.keys())
        const results = []

//        console.log({ items_uids_length: items_uids.length    })

        for(const item_uid of items_uids) {
            for(const assoc of lookup.get(item_uid)) {
                   // yield assoc
//                console.log({assoc_counter: assoc.counter })

                    results.push(assoc)

            }
        }

        return results
    }

    const debug = () => {
         return lookup
    }

    const roles_count= roles_names.length

    return { collect, get_collected, debug }
}

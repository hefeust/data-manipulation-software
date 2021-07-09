
export const uids_selector = (roles_names) => {

    const lookup = new Map()

    const collect = (record) => {
        const { item_uid } = record
        const collected = lookup.get(item_uid) || []

        collected.push(record)

        lookup.set(item_uid, collected)
    }

    const get_collected = function* () {
        const items_uids = Array.from(lookup.keys())

//        console.log(lookup)

        for(const item_uid of items_uids) {
            const collected = lookup.get(item_uid)

            // console.log('collected', collected.length)
            
            if(collected.length === roles_names.length) {
                yield collected
            } 
        }
    }

    const debug = () => {
        return lookup
    }

    return {
        collect,
        get_collected,
        debug
    }
}

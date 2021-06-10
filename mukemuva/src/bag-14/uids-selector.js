
export const uids_selector = (roles_names) => {
    const lookup = new Map()

    const collect = (record) => {
        const { item_uid } = record
        const collected = lookup.get(item_uid)  || []

//        console.log('     collect', { collected })

        collected.push(record)
        lookup.set(item_uid, collected)
    }

    const get_collected = function* () {
        const keys = Array.from(lookup.keys())

//        console.log('     get_collected', lookup)

        for(const uid of keys) {
            const collected = lookup.get(uid)

            if (collected.length === roles_names.length) 
                yield collected

        }
    }

    const debug = () => {
        return lookup        
    }

    return { collect, get_collected, debug }
}

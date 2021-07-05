
export const uids_selector = (roles_names) => {
    
    const lookup = new Map()

    const collect = (role_uid, part_uid, item_uid) => {
        const collected = lookup.get(item_uid) || []

        collected.push({ role_uid, part_uid, item_uid })
        lookup.set(item_uid, collected)

        console.log('COLLECT')
    }    

    const get_collected = function* () {
//        roles_names.map((role_name) => {})
//        const keys = Array.from(lookup.keys())

        console.log({ lookup })

        for(const [key, collected] of lookup) {
            console.log('GET_COLLECTED', { key , value })

            if (collected.length === roles_names.length) {
                yield { key, collected }
            }
        }
        
    }

    return { collect, get_collected }
}

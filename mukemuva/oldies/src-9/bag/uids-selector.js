
export const uids_selector = (roles_names) => {
    
    const lookup = new Map()

    const collect = (role_uid, part_uid, item_uid) => {
//        items_uids.map((item_uid) => {
            const collected = lookup.get(item_uid) || []

            collected.push({ role_uid, part_uid })

            lookup.set(item_uid, collected)
//        })
    }    

    const get_collected = function* () {
//        roles_names.map((role_name) => {})
//        const keys = Array.from(lookup.keys())

        for(const [key, value] of lookup) {
            console.log('GET_COLLECTED', { key , value })
        }
        
    }

    return { collect, get_collected }
}

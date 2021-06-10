
export const bags = (bmp) => {

    const find = (actual_uids, will_add) => {
        const search_lookup = new Map()
        const empty_block = { data: null }
        let found = []
        let new_uid = null

//        console.log('bags.find')
//        console.log({ actual_uids_length: actual_uids.length , will_add})
//        console.log({ actual_uids })

        actual_uids.map((actual_role_uid, idx) => {
            const actual_role = bmp.get_data(actual_role_uid)
            
//            console.log(actual_role)

            actual_role.items.map((item_uid) => {
                const count =  search_lookup.get(item_uid) || 0

                if(count === idx) {
//                    console.log('count: ' + item_uid)
                    search_lookup.set(item_uid, 1 + count)
                } else {
//                    console.log('delete: ' + item_uid)
                    search_lookup.delete(item_uid)
                }
            })
        })

        found = Array.from(search_lookup.keys())        

        if(found.length === 1) {
//            console.log(1)
            return found[0]
        } else if(will_add) {
            new_uid = bmp.set_data(empty_block)

            actual_uids.map((actual_role_uid) => {
                const actual_role = bmp.get_data(actual_role_uid)

                actual_role.items.push(new_uid)
            })

            return new_uid
        }

        return null
    }

    const store_data = (uid, with_data) => {
        const stored = bmp.get_data(uid)
	
        if(stored) {
            stored.data = with_data

            return true
        } else {
            console.log('bags.store: data bag not found for uid=', uid)
            return  false
        }
    }

    const get_data = (uid) => {
        const stored = bmp.get_data(uid)       

        if(stored.data) {
            return stored.data
        } else {
            return null
        }
    }
    
    return {
        find, store_data, get_data
    }
}

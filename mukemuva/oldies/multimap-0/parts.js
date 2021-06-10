
export const parts = (bmp) => {
      
    const select_parts = (actual_roles, collector) => {
//        console.log('select-parts')

        const lookup = new Map()

        actual_roles.sort((a1, a2) => {
            return a1.counter - a2.counter
        }).map((actual_role, idx) => {
            actual_role.items.map((uid) => {
                const count = lookup.get(uid) || 0

                // console.log('=====', uid)

                if(count === idx) {
                    lookup.set(uid, 1 + count)
                } else {
                    lookup.delete(uid)
                }
            })
        })

//        console.log(Array.from(lookup.keys() ).length)

        collector(Array.from(lookup.keys()))
    }

    const store = (actual_roles, stored_data) => {
//        console.log('parts_bmp.store' )
    
        select_parts(actual_roles, (collected) => {
            let uid = null
            let data = null

//            console.log(collected)

            if(collected.length === 0) {
                uid = bmp.set_data({ stored_data })

                actual_roles.map((role) => {
                    role.items.push(uid)
                })
            } else {
                collected.map((uid) => {
                    data = bmp.get_data(uid)
                    data.stored_data = stored_data                                    
                })
            } 
        })
    }

    const parts_api = { select_parts, store  }

    return parts_api
}

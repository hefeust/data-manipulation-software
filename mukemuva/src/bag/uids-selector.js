
export const uids_selector = (roles_names) => {
    const lookup = new Map()

    const collect = (record) => {
        const { item_uid } = record
        const collected = lookup.get(item_uid) || []
        let found = false

//        console.log('     collect', { collected })
        // *********
        for(const entry of collected) {
            if (entry.role_uid !== record.role_uid) continue
            if (entry.part_uid !== record.part_uid) continue
            if (entry.item_uid !== record.item_uid) continue

            found = true
//            collected.push(record)
        }
 
        if(found === false) collected.push(record)
        

        // *********

//        collected.push(record)
        lookup.set(item_uid, collected)
    }

    const get_collected = function* () {
//        console.log(lookup)

        const items_uids = Array.from(lookup.keys())
        const acc = new Map()

        for (const item_uid of items_uids) {
            const records = lookup.get(item_uid)


//            console.log(records)

            for (const record of records) {
                const { collect_idx } = record
                const extracted = acc.get(collect_idx) || []
                
                extracted.push(record)               
                acc.set(collect_idx, extracted)

                if (extracted.length === roles_names.length) {
                    // console.log(extracted.length)
                    yield extracted
                }
            }
        }
    }

    const debug = () => {
        return lookup        
    }

    return { collect, get_collected, debug }
}

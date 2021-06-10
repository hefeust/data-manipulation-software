
export const wrap_role = (ctx) => {
    const { ducks } = ctx

    const wrap = (def) => {
        const { uid, ducktype, block} = def

        const lookup = new Map()

        const install_part = async (part_value) => {
            let uid, part

            if (lookup.has(part_value)) {
                uid = lookup.get(uid)
            } else {
               uid = await ducks.create('part').with_data({ part_value })
               lookup.set(part_value, uid)
            }           

            return  uid
        }


        const add_part = async (part_value) => {
            const part_uid = await ducks.create('part').with_data({ part_value })
        
            block.related.push(part_uid)  
            block.counter++
            lookup.set(part_value, part_uid)
        }

        const get_part = async (part_uid) => {
            for (const uid of related) {
                if(part_uid === uid) {
                    return await ducks.hydrate(part_uid)
                }
            }

            return null
        }

        const select_parts = async function* (filter) {
            for (let part_uid of block.related) {
                const part = await ducks.hydrate('part').with_uid(part_uid)

                if (filter === '*') yield part
                if (part_value === filter) yield  part 
                if (filter(part.part_value)) yield part
            }
        }

        return {
            uid, install_part, add_part, get_part, select_parts
        }
 

    }

    return { wrap }
}


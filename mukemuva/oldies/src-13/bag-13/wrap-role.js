
export const wrap_role = (ctx) => {
    const { ducks } = ctx

    const wrap = (def) => {
        const { uid, ducktype, block } = def

        const lookup = new Map()

        const install_part = async (part_value) => {
            let uid, part

            if (lookup.has(part_value)) {
                uid = lookup.get(uid)
            } else {
               uid = await ducks.create('part').with_data({ part_value })
               lookup.set(part_value, uid)

                block.related.push(uid)  
                block.counter++
            }           

            return  uid
        }


        const add_part = async (part_value) => {
            const part_uid = await ducks.create('part').with_data({ part_value })
        
            block.related.push(part_uid)  
            block.counter++
            lookup.set(part_value, part_uid)

            return part_uid
        }

        const get_part = async (part_uid) => {
            for (const uid of related) {

                if(part_uid === uid) {
                    return await ducks.hydrate('part').for_uid(part_uid)
                }
            }

            return null
        }

        const select_parts = async function* (filter) {

            const ots = ({ }).toString.call(filter)

            const test = (value, expected)   => {
                if (expected === '*') {
                    return true
                } else if (typeof expected === 'function') {
                    return expected(value)
                } else {
                    return value === expected
                }
            }

            for (let part_uid of block.related) {
//                console.log({ [part_uid]: ducks.hydrate('part') })
                const part = await ducks.hydrate('part').for_uid(part_uid)

                console.log('PART',  part.debug())

                if (test(part.part_value, filter)) yield part
            }
        }

        const debug = () => {
            return `${uid}\t role\t [${block.counter}]`
        }

        return {
            uid, 
            install_part, 
            add_part, 
            get_part, 
            select_parts,
            debug
        }
    }

    return { wrap }
}


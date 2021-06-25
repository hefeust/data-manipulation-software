
import * as ducktypes from './ducktypes.js'

export const wrap_role = (context) => {

    const { pool, debug, ducks } = context

    const set_part = async (def, part_value) => {
        const { uid, ducktype, block } = def
        const { lookup } = block.data

        let part_uid, part
        
        if (lookup.has(part_value)) {
            part = await ducks.hydrate({
                uid: lookup.get(part_value), 
                ducktype: ducktypes.DUCKTYPE_PART
            })
        } else {
            part = await ducks.create({
                data: { part_value },
                ducktype: ducktypes.DUCKTYPE_PART
            })

            lookup.set(part_value, part.uid)
            block.related.push(part.uid)
        }

        return part
    }

    const get_part = async (def, part_uid) => {
        const { uid, ducktype, block } = def
        const part_idx = block.related.indexOf(part_uid)
        let part = null

        if(part_idx > -1) {
            part = await ducks.hydrate({
                uid: block.related[part_idx],
                ducktype: ducktypes.DUCKTYPE_PART
            })
        }

        return part
    }


    const test_value = (part, expected) => {
       if(expected === '*') return true
       if(typeof expected === 'function') 
           return expected(part.part_value)
           
       return expected === part.part_value
    }

    const select_parts = async (def, filter) => {
        const { uid, ducktype, block } = def        
        const { lookup } = block.data
        const results = []

//        console.log({ SELECT_PARTS: lookup })

        if (lookup.has(filter)) {
//            console.log('ROLE LOKKUP MATCH !')

            const part_uid =  lookup.get(filter)

            const part = await ducks.hydrate({
                ducktype: ducktypes.DUCKTYPE_PART,
                uid: part_uid
            })

            results.push(part)
        } else {
            for (let part_uid of block.related) {
                const part = await ducks.hydrate({
                    ducktype: ducktypes.DUCKTYPE_PART,
                    uid: part_uid
                })
//                    console.log({ part: part.get_part_value() })

                if (test_value(filter)) {
                    results.push(part)
                }
            }
       }

//            console.log({ results: results.length })

       return  results 
    }

    const wrap = (def) => {
        const { uid, ducktype, block } = def

        return { 
            uid, ducktype, role_name: block.data.role_name,
            set_part: (part_value) => set_part(def, part_value),
            get_part: (part_uid) => get_part (def, part_uid),
            select_parts: (filter) => select_parts(def, filter)
        }
    }

    return { wrap }
}

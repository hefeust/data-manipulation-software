
import { wrap_role } from './wrap-role.js'
import { wrap_part } from './wrap-part.js'
import { wrap_item } from './wrap-item.js'

export const DUCK_ROLE = 'R'
export const DUCK_PART = 'P'
export const DUCK_ITEM = 'I'

export const duck_blocks = (context) => {

    const { pool, ducks, debug } = context

    const funcs = {
       role: wrap_role(context),
       part: wrap_part(context),
       item: wrap_item(context)
    }

    const create = async (def)  => {
        const { ducktype, data } = def
        
        const block = {
            data,
            related: [],
            counter: 0
        }

        const uid = await pool.set_data(block)

        return wrap({ uid, ducktype, block, debug })
    }

    const hydrate = async (query)  => {
        const { ducktype, uid } = query

//        console.log({ HYDRATE: query })

        const block = await pool.get_data(uid)

        return wrap({ uid, ducktype, block, debug})        
    }

    const wrap = (def)  => {
        const { uid, ducktype, debug } = def



//        console.log(funcs[ducktype])

        const wrapped = funcs[ducktype].wrap(def)

        return wrapped
    }

    return {
        create,
        hydrate
    }
}

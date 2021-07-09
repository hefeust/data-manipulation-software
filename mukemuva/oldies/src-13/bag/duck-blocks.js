
import * as ducktypes from './ducktypes.js'
import { wrap_role } from './wrap-role.js'
import { wrap_part } from './wrap-part.js'
import { wrap_item } from './wrap-item.js'

export const duck_blocks = (context) => {

    const { pool, debug } = context

    const create = async (def) => {
        const { ducktype, data } = def

//        console.log({ CREATE: ducktype })

        const block = { 
            data, 
            related: [],
            counter: 0
        }

        const uid = await pool.set_data(block)

        if(debug) {
            block.debug = {
                uid,
                ducktype
            }
        }

        return wrap({ uid, ducktype, block })
    }

    const hydrate = async (query) => {
        const { ducktype, uid } = query

//        console.log({ HYDRATE: ducktype, uid })

        const block =  await pool.get_data(uid)       

        if(debug) {
            if (block.debug.uid !== uid)  {
                throw new Error ('duck_blocks.hydrate ERROR  UID INCONSISTENCY: ' 
                    + uid + ' !== ' + block.debug.uid)
            }

            if (block.debug.ducktype !== ducktype) {
                console.log(block)

                throw new Error ('duck_blocks.hydrate ERROR DUCKTYPE INCONSISTENCY: ' 
                    + ducktype + ' !== ' + block.debug.ducktype)
            }
        }

        return wrap({ uid, ducktype, block })
    }

    const wrap = (def) => {
        const { uid, ducktype, block } = def

        const wrappers = {
            role: wrap_role(context),
            part: wrap_part(context),
            item: wrap_item(context)
        }

        const wrapper = wrappers[ducktypes.toString(ducktype)]
//        const wrapper = wrappers[ducktype]

//        console.log({ ducktype })

        if(! wrapper)
            throw new Error ('ducks_blocks.wrap: WRAPPER NOT FOUND ! ducktype='  + ducktype)

        return wrapper.wrap(def)
    }

    const trace = () => {}

    return {
        create, hydrate, trace
    }
}

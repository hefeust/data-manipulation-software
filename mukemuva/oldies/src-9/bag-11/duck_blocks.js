
import { wrap_role } from './wrap_role.js'
import { wrap_part } from './wrap_part.js'
import { wrap_item } from './wrap_item.js'

export const duck_blocks = (ctx) => {

    const wrappers = {
        role: wrap_role(ctx),
        part: wrap_part(ctx),
        item: wrap_item(ctx),
    }


    const create = (ducktype) => {
        return {
           with_data: (payload) => {
                const block = {
                    uid: null,
                    ducktype,
                    payload,
                    counter: 0
                }

                return wrappers[ducktype].wrap(block)
           }
        }
    }

    // @return duck block
    const hysrate = (ducktype) => {
        return {
            with_uid: (uid) => {

                const block = pool.get_data(uid)
                
                if(ducktype !== block.ducktype)
                    throw new Error('bad ducktype', { uid, ducktype})

                return wrappers[ducktype].wrap(block)
            }
        }
    }

    // @return uid
    const save = (ducktype) => {
        return {
            for_block: (block) => {
                const uid = pool.set_data(block)

                if(block.ducktype !== duck_type) 
                    throw new Error('bad ducktype', { uid, ducktype})

                return uid
            }
        }
    }

    return { create, hydrate }
}

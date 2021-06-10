    
import { wrap_role } from './wrap-role.js'
import { wrap_part } from './wrap-part.js'
import { wrap_item } from './wrap-item.js'

export const duck_blocks = (ctx) => {

    const { pool } = ctx

    const wrap = (def) => {
        const { uid, block, ducktype } = def

//        console.log('WRAP', { def })

        const funcs = {
            role: wrap_role(ctx),
            part: wrap_part(ctx),
            item: wrap_item(ctx)
        }

        return funcs[ducktype].wrap(def)
     }


    const create = (ducktype) => {
//        console.log('#')

        return {
            with_data: async (data) => {
                const block = {
                    ducktype, 
                    data, 
                    related: [], 
                    counter: 0
                }

                const uid = await pool.set_data(block)

                const result = wrap({ uid, ducktype, block })

                return uid
            }
        }
    }

    const hydrate =  (ducktype) => {
        return {
            for_uid: async (uid) => {
                const block = await pool.get_data(uid)


                const wrapped =  wrap({ 
                    uid, block, ducktype: 'role'
                })

//                 console.log('HYDRATE', wrapped)

                return wrapped
            }
        }        
    }

    return {
        create, hydrate
    }
}


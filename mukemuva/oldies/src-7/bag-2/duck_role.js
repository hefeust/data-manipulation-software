
import { duck_part } from './duck_part.js'

export const duck_role = (pool) => {

    const pooled_part = duck_part(pool)

    const create =  (name) => {
        const block = {
            duck: 'ROLE',
            name,
            parts: [],
            stats: {
                counter: 0
            }
        }

//        return wrap(block)
        return block
    }

    const hydrate = async (uid) => {
        const block = await pool.get_data(uid)
        //console.log('    hydrate: ', { uid })
        return block
    }

    const save = async (block) => {
        const uid = await pool.set_data(block)
        // console.log('    roles_lookup.save: ', { block })
        return uid
    }

    const wrap = async (uid, duck) => {
//        console.log('    wrap: ', { block })

        const set_part = async (value) => {
            let len = duck.parts.length
            let  i = 0
            let uid, block, part

            while (i++ < len) {
                uid = duck.parts[uid]
                block = await pooled_part.hydrate(uid)
                part = await pooled_part.wrap(block)
                
                return part
            }            

            block = pooled_part.create(value)
            uid = await pooled_part.save(block)
            part = await pooled_part.wrap(block)
            
            return part
        }

        const get_part = async (value) => {

        }

        const select_part = async (filter) => {


        }

        const get_stats = () => block.stats

        return {
            uid, name: duck.name,  set_part, get_part, select_part
        }
    }

    return {
        create, hydrate, save, wrap
    }
}


import { duck_parts } from './duck_parts.js'

export const duck_roles = (ctx) => {

    const { pool } = ctx

    const parts = duck_parts(ctx)

    const create = (role_name) => {
        return {
            role_name,
            duck: 'role',
            parts_list: [],
            counter: 0
        }
    }

    const hydrate = async (uid) => {
        const block = await pool.get_data(uid)

        block.uid = uid

        return block
    }

    const save = async (block) => {
        const uid = await pool.set_data(block)
    
        return uid  
    }


    const wrap = (block) => {

        const set_part = async (value ) => {
            const duck = parts.create(value)
            const uid = await parts.save(duck)

            block.counter++

            return uid
        }
        
        const get_part = async (value ) => {}

        const select_parts = async (filter) => {
//            console.log('seelct_part for block= ' +  toString( block ))
            const results = []

            const delayed = await block.parts_list.map(async (uid) => {
                const duck = await parts.hydrate(uid)
                const part = parts.wrap(duck)

//                console.log('### role.select_parts', part.items_list)

                if(filter === part.part_value) results.push(part)
                if(filter === '*') results.push(part)
            })                     

            const resolved = await Promise.all(delayed)

            return results
        }

        const toString = () => {
            const { uid, duck, role_name, counter} = block

            return `BLOCK<${duck}> [@${uid}]: "${role_name}" (#${ counter })`
        }

 
        return {
            ...block,
            set_part, get_part, select_parts, toString
        }
    }




    return { create, hydrate, save, wrap }
}


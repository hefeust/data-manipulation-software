
import { duck_parts } from './duck_parts.js'

export const duck_roles = (ctx) => {

    const { pool } = ctx

    const parts = duck_parts(ctx)

    const create = (role_name) => {
        return {
            role_name,
            duck_type: 'role',
            parts: [],
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

            block.parts.push(uid)
            block.counter++

//            console.log({ set_part: uid })

            return uid
        }
        
        const get_part = async (value ) => {}

        const select_parts = async (filter) => {
//            console.log('seelct_part for block= ' +  toString( block ))
            const results = []

            const delayed = await block.parts.map(async (uid) => {
                const duck = await parts.hydrate(uid)
                const part = parts.wrap(duck)

//                console.log('### role.select_parts', part.items_list)

                if(filter === part.block.part_value) results.push(uid)
                if(filter === '*') results.push(uid)
            })                     

            const resolved = await Promise.all(delayed)

//            console.log({ results })

            return results
        }

        const toString = () => {
            const { uid, duck, role_name, counter} = block

            return `BLOCK<${duck}> [@${uid}]: "${role_name}" (#${ counter })`
        }

 
        return {
            block,
            set_part, get_part, select_parts, toString
        }
    }




    return { create, hydrate, save, wrap }
}


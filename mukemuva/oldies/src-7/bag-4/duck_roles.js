
import { duck_parts } from './duck_parts.js'

export const duck_roles = (ctx) => {

    const { pool } = ctx

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
            
        }
        
        const get_part = async (value ) => {}

        const select_parts = async (filter) => {
//            console.log('seelct_part for block= ' +  toString( block ))
            const results = []

            const delayed = block.parts_list.map(async (uid) => {
                const duck = await parts.hydrate(uid)
                const part = await parts.wrap(duck)

                console.log('### role.select_parts', part.items_list)

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

        const atomic_set = async (part_value) => {
//            return {
//                save: async () => {
                    const parts = duck_parts(ctx)
    
                    const owned_parts = block.parts_list.map(async (uid) => {
                        return await parts.hydrate(uid)
                    })
    
                    const filtered = owned_parts.filter(async (part) => {
                        return part.duck === 'part' && part.part_value === part_value
                    })
    
                    if(filtered.length === 0) {
                        const duck = parts.create(part_value)
                        const uid = await parts.save(duck)
    
                        filtered[0] = duck
                    } 
    
                    return parts.wrap(filtered[0])
//                }
//            }
        }

        return {
            ...block,
            set_part, get_part, select_parts, toString,
            atomic_set
        }
    }




    return { create, hydrate, save, wrap }
}


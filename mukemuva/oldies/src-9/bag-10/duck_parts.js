
import { duck_items } from './duck_items.js'

export const duck_parts = (ctx) => {

    const items = duck_items(ctx)
    
    const { pool } = ctx

    const create =  (part_value) => {
        return ({
            part_value, 
            duck_type: 'part',
            counter: 0,
            items: []
        })
    }

    const hydrate = async (uid) => {
        const block = await pool.get_data(uid)

        if(!block) 
            throw new Error('No block attached to uid=' + uid)

        if(block.duck_type !== 'part') {
//            console.log({ [uid]: block.duck_type  })
            throw new Error('Wrong duck_type for block at uid=' + uid)
        }

        block.uid = uid

        return block
    }

    const save = async (block) => {
        const uid = await pool.set_data(block)

        return uid
    }

    const wrap = (block) => {
        const set_item =  (uid) => {
            block.counter++
            block.items.push(uid)

//            console.log({ SET_ITEM: uid })

            return uid
        }

        const add_item = async (with_data) => {
            const duck = items.create(with_data)
            const uid = await items.save(duck)

            block.counter++
            block.items.push(uid)

//            console.log({ ADD_ITEM: uid })

            return uid
        }

        const get_item = async (uid) => {
            if (block.items.indexOf(uid) === -1)
                throw new Error('No child in collection  for uid=' + uid)

            const item = await items.hydrate(uid)

            return item
        }

        const select_items = async (filter) => {
            return block.items
        }

        return {
            block, add_item, set_item, get_item, select_items
        }
    }


    return { create, hydrate, save, wrap }
}   

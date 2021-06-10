
export const duck_parts = (ctx) => {

    const { pool } = ctx

    const create = (part_value) => {
        return {
            part_value,
            duck: 'part',
            items_list: [],
            counter: 0
        }
    }

    const hydrate = async (uid) => {
        const block = await pool.get_data(uid)

        block.uid = uid

        return block
    }

    const save = async (block) => {
        const uid = pool.set_data(block)
        
        return uid
    }

    const wrap = (block) => {

//        console.log({ block })

        const set_item = async (with_data) => {
//            const duck = await pool.get_block(uid)

//            const uid = await pool.set_data(with_data)
            // console.log({ set_item:  uid })
//            block.items_list.push(uid)
//            block.counter++

            const part_uid = block.uid
            const item_uid = await pool.set_data(with_data)
            const block_part = await pool.get_block(part_uid)
            const duck_part = block_part.data

            duck_part.items_list.push(item_uid)
            duck_part.counter++



            return item_uid
        }

        const get_item = async (uid) => {
            const block = await pool.get_data(uid)

            return block.data
        }

        const select_items =  (filter) => {
//            console.log('select_items', block.items_list)

            return block.items_list            
        }

        return {
            ...block,
            set_item, get_item, select_items
        }
    }

    const setup = () => {

    }

    setup()

    return {
        create, hydrate , save, wrap
    }
}


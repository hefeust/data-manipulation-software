

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

        return block
    }

    const save = async (block) => {
        const uid = pool.set_data(block)
        
        return uid
    }

    const wrap = (block) => {

        const set_item = async (with_data) => {
            const uid = await pool.set_data(with_data)

            block.list_items.push(uid)

            return uid
        }

        const get_item = async (uid) => {
            const block = await pool.get_data(uid)

            return block.data
        }

        const select_items =  (filter) => {
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


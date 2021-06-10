
export const duck_parts = (ctx) => {
    
    const create = async (part_value) => {
        const uid = await pool.set_dara({
            part_value, 
            duck_type: 'part',
            counter: 0,
            items: []
        })

        return uid
    }

    const hydrate = async (uid) => {
        const block = await pool.get_data(uid)

        if(!block) 
            throw new Error('No block attached to uid=' + uid)

        if(block.duck_type !== 'part')
            throw new Error('Wrong duck_type for block at uid=' + uid)

        return block
    }

    const save = (duck) => {}

    const wrap = (duck) => {



        return {
            duck, set_item, get_item, select_item
        }
    }


    return { create, hydrate, save, wrap }
}

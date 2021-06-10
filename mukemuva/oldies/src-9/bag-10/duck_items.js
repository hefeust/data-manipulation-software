
export const duck_items = (ctx) => {
    const { pool } =  ctx 

    const create = (with_data) => {
        return { 
            duck_type: 'item',
            with_data
         }
    }

    const hydrate = async (uid) => {
        const block = await pool.get_data(uid)
        if(!block) 
            throw new Error('No block attached to uid=' + uid)

        if(block.duck_type !== 'item') {
//            console.log({ [uid]: block.duck_type  })
            throw new Error('Wrong duck_type for block at uid=' + uid)
        }


        block.uid = uid
        return block
    }

    const save = async (block) => {
        const uid = await pool.set_data(block)
        block.uid = uid
        return uid
    }

    return { create, hydrate, save }
}

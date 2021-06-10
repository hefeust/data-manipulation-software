
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

        return block
    }

    const save = async (block) => {
//        console.log(pool)

        const uid = await pool.set_data(block)

        return uid
    }

    return { create, hydrate, save }
}

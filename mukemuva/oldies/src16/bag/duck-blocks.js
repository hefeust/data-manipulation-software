
export const duck_blocks = (context) => {

    const { pool } =  context.tooling

    const create = async (def) => {
        const { ducktype, fellow, payload } = def


      const block = {
            ducktype,
            payload,
            fellow,
            related: [],
            lookup: new Map(),
            counter: 0
        }

        const uid = await pool.set_data(block)
       
        block.uid = uid

        return block        
    }

    const hydrate = async (query) => {
        const { uid, ducktype, fellow } = query

        const block = await pool.get_data(uid)

        if(!block) 
            throw new Error('duck_blocks.hydrate: block not found @uid = ' + uid)

        if(block.ducktype !== ducktype)
           throw new Error('duck_blocks.hydrate: ducktype inconsistency !!!')


        return block
    }

    return {
        create,
        hydrate
    }
}

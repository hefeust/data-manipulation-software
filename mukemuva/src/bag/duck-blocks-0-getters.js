
export const duck_blocks = (context) => {

    const { pool } =  context.tooling

    const create = async (def) => {
        const { ducktype, fellow, payload } = def

/*
        const block = {
            ducktype,
            data,
            fellow: null,,
            related: [],
            counter: 0
        }
*/

        const block = {}
        const uid = await pool.set_data(block)
       
//        console.log('duck_blocks.create', { uid, ducktype, fellow })
 
        Object.defineProperty(block, 'uid',     { 
            get: () => uid 
        })

        Object.defineProperty(block, 'ducktype',{ 
            get: () => ducktype 
        })

        Object.defineProperty(block, 'fellow',{ 
            get: () => fellow
        })

        Object.defineProperty(block, 'payload', { 
            get: () => payload
        })

        Object.defineProperty(block, 'refs',    { get: () => {
            return {
//                fellow, 
                related: [],
                counter: 0
            }
        } })

        return block        
    }

    const hydrate = async (query) => {
        const { uid, ducktype, fellow } = query

//        console.log({ uid })

        const block = await pool.get_data(uid)

        if(!block) 
            throw new Error('duck_blocks.hydrate: block not found @uid = ' + uid)

        if(block.ducktype !== ducktype)
            throw new Error('duck_blocks.hydrate: ducktype inconsistency !!!')

//        if(block.refs.fellow !== fellow )
//            throw new Error('duck_blocks.hydrate: bad blcok fellow uid !!!')

//        console.log({ HYDRATE: block })


        return block
    }

    return {
        create,
        hydrate
    }
}

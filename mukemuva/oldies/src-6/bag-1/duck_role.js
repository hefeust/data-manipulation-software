

export const duck_role = (pool) => {

    const create =  (name) => {
        const block = {
            duck: 'ROLE',
            name,
            parts: []
        }

        return wrap(block)
//        return block
    }

    const hydrate = async (uid) => {
        console.log('    hydrate: ', { uid })
        const block = await pool.get_data(uid)

        console.log('    hydrate: ', { uid, block })

        return wrap(block)
//        return block
    }

    const save = async (block) => {
        const uid = await pool.set_data(block)

        return uid
    }

    const wrap = async (block) => {
        console.log('    wrap: ', { block })

        const set_part = async (value) => {

        }

        const get_part = async (value) => {

        }

        const select_part = async (filter) => {

        }
    }


    return {
        create, hydrate, save, wrap
    }
}

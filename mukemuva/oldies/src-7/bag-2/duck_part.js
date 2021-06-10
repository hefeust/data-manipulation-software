
export const duck_part = (pool) => {

    const create = (value) => {
        return {
            duck: 'PART',
            value,
            items: []
        }
    }

    const hydrate = async (uid) => {
        const block = await pool.get_data(uid)
//        console.log('    hydrate: ', { uid })
        return block
    }

    const save = async (block) => {
        const uid = await pool.set_data(block)
        // console.log('    roles_lookup.save: ', { block })
        return uid
    }

    const wrap = (duck) => {

        const set_item = async (stuff) => {
            const { collector, role_name, with_data } = stuff 
            console.log('### SET_ITEM ###')
            console.log({ with_data })
            console.log('###')

            const collected = await collector.collect_uids(role_name, duck.items)
        }

        const get_item = async (uid) => {}

        const select_item = async (filter) => {}

        return { 
            duck: duck.duck,
            value: duck.value,
            set_item, get_item, select_item }
    }

    return { create, hydrate, save, wrap }
}

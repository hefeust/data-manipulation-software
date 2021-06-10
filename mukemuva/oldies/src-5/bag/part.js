
export const create_part = () => {

    const items_list = []
    const items_lookup = new Map()
    const stats = { couner: 0 }

    const set_item = async (data) => {

    }

    const get_item = async (uid) => {

    }

    const part_api = { set_item, get_item }

    return {
        insall_to: async (bmp) => {
            const part = { items_list, items_lookup, stats}
            const uid = await bmp.set_data(part)

            return part_api
        }
    }

}

